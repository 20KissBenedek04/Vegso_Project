const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// adatbázis eszközök
const {
    sequelize,
    InitDB,
    User,
    Animal,
    AnimalType,
    MedicalRecord,
    Species,
    Logs,
    Enclosure
} = require('./dbHandler');




// környezeti változók
const BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS;
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;


// alkalmazás

const app = express();
app.use(helmet());
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());

// auth
function optionalAuth(req, res, next) {
    const hdrAuth = req.headers.authorization || ''
    if (!hdrAuth.startsWith('Bearer ')) {
        return next();
    }
    try {
        req.user = jwt.verify(hdrAuth.split(' ')[1], JWT_SECRET);
    } catch (error) {
        console.log('optional auth error: ', error);
    }
    next()
}

function roleCheck(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'nem megfelelő user' })
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'nem megfelelö szerepkör a létrehozáshoz' })
        }
        next()
    }
}

const signToken = (user) => jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES })

const writeLog = (action, targetType, targetId, userId) => Logs.create({
    action: action,
    targetType: targetType,
    targetId: targetId,
    userId: userId
})

// POST requests
// POST api/auth/login - bejelentkezés(email, jelszó) - KÉSZ
app.post('/api/auth/login', async (req, res, next) => {
    try {
        const { email, password } = req.body || {}
        if (!email || !password) {
            return res.status(400).json({ message: 'Hiányzó adatok, hiányzó email vagy password' })
        }
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({ message: 'Hibás email' })
        }
        if (password !== user.password) {
            return res.status(401).json({ message: 'Hibás jelszó' })
        }
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role, token: signToken(user) })
    } catch (error) {
        console.log('login error: ', error)
        next(error)
    }
})

// POST api/auth/register - regisztráció(vendég regisztráció => name, email, password) - KÉSZ
app.post('/api/auth/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body || {}
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Hibás adatok(name, email, password)' })
        }
        const userExist = await User.findOne({ where: { email } })
        if (userExist) {
            return res.status(409).json({ message: 'Az email már használatban van' })
        }
        const createdUser = await User.create({ name: name, email: email, password: password, role: 'guest' })
        return res.status(201).json({ id: createdUser.id, name: createdUser.name, email: createdUser.email, role: createdUser.role, token: signToken(createdUser) })
    } catch (error) {
        console.log('registration error: ', error)
        next(error)
    }
})

//POST api/animals - új állat létrehozása(admin vagy employee) - KÉSZ
app.post('/api/animals', optionalAuth, roleCheck('admin', 'employee'), async (req, res, next) => {
    try {
        const { name, speciesId, typeId, enclosureId, birthDate, weight, isActive, imageURL } = req.body || {}
        if (!name || !isActive || !speciesId || !typeId) {
            return res.status(400).json({ message: 'Hiányzó adatok' })
        }
        const animalExist = await Animal.findOne({ where: { name } })
        if (animalExist) {
            return res.status(409).json({ message: 'Már van ilyen nevű állat' })
        }
        const createdAnimal = await Animal.create({
            name: name,
            speciesId: Number(speciesId),
            typeId: Number(typeId),
            enclosureId: Number(enclosureId),
            birthDate: birthDate,
            weight: weight,
            isActive: isActive,
            imageURL: imageURL
        })
        await writeLog('ANIMAL_CREATE', 'Animal', createdAnimal.id, req.user.id);
        return res.status(201).json(createdAnimal)
    } catch (error) {
        console.log('Creating error: ', error)
        next(error)
    }
})

//POST api/animals/:id/records - csak vet hozhat létre új orvosi bejegyzést(súlyt és kifutó módosíthat) - KÉSZ
app.post('/api/animals/:id/records', optionalAuth, roleCheck('vet'), async (req, res, next) => {
    try {
        const { description, weight, enclosure } = req.body || {}
        const animalId = req.params.id

        if (!description) return res.status(400).json({ message: 'Nincs megadva bejegyzés' })

        const animal = await Animal.findByPk(animalId)
        if (!animal) return res.status(400).json({ message: 'Állat nem található' })

        if (typeof weight !== 'undefined') animal.weight = Number(weight)
        if (typeof enclosure !== 'undefined') {
            if (isNaN(enclosure)) {
                const encl = await Enclosure.findOne({ where: { name: enclosure } })
                if (!encl) {
                    return res.status(404).json({ message: 'Módosítandó kifutó nem létezik' })
                }
                animal.enclosureId = encl.id
            } else {
                animal.enclosureId = Number(enclosure)
            }
        }
        animal.save()
        const medicalRecord = {
            description: description,
            vetId: req.user.id,
            animalId: animalId,
            weight: typeof weight === 'number' ? weight : null,
            enclosure: typeof enclosure !== 'undefined' ? String(enclosure) : null
        }
        const createdRecord = await MedicalRecord.create(medicalRecord)
        await writeLog('MEDICAL_RECORD_CREATE', 'MedicalRecord', createdRecord.id, req.user.id)
        return res.status(201).json(createdRecord)
    } catch (error) {
        console.log('Create record error: ', error)
        next(error)
    }
})

//POST api/admin/users => user létrehozása(employee vagy vet) - KÉSZ
app.post('/api/admin/users', optionalAuth, roleCheck('admin'), async (req, res, next) => {
    const { name, email, password, role } = req.body || {}
    if (!name || !email || !password || !role) return res.status(400).json({ message: 'Hibás adatok' })
    if (role === 'admin' || role === 'guest') return res.status(400).json({ message: 'CSak orvos vagy dolgozó hozható létre' })
    const user = await User.create({
        name: name,
        email: email,
        password: password,
        role: role
    })
    await writeLog('USER_CREATE', 'User', user.id, req.user.id)
    return res.status(201).json({ message: 'Sikeres létrehozás' })
})

// PUT requests
// PUT api/animals - Állat módosítása ID alapján (employee/admin mindent | vet csak weight és enclosureID-t módosíthat) - KÉSZ
app.put('/api/animals/:id', optionalAuth, roleCheck('admin', 'employee', 'vet'), async (req, res, next) => {
    try {
        const animalId = Number(req.params.id)
        const role = req.user.role
        const animal = await Animal.findByPk(animalId)
        if (!animal) {
            return res.status(404).json({ message: 'Nincs ilyen ID-jú állat' })
        }
        if (role !== 'vet') {
            const { name, speciesId, typeId, enclosureId, birthDate, weight, isActive, imageURL } = req.body || {}
            if (typeof name !== 'undefined') animal.name = name
            if (typeof speciesId !== 'undefined') animal.speciesId = Number(speciesId)
            if (typeof typeId !== 'undefined') animal.typeId = Number(typeId)
            if (typeof enclosureId !== 'undefined') animal.enclosureId = Number(enclosureId)
            if (typeof birthDate !== 'undefined') animal.birthDate = birthDate
            if (typeof weight !== 'undefined') animal.weight = Number(weight)
            if (typeof isActive !== 'undefined') animal.isActive = isActive
            if (typeof imageURL !== 'undefined') animal.imageURL = imageURL
        }
        else {
            const { enclosureId, weight } = req.body || {}
            if (typeof enclosureId !== 'undefined') animal.enclosureId = Number(enclosureId)
            if (typeof weight !== 'undefined') animal.weight = Number(weight)
        }
        await animal.save()
        await writeLog('ANMAL_UPDATE', 'Animal', animal.id, req.user.id)
        return res.status(200).json({ message: 'Sikeres módosítás' })
    } catch (error) {
        console.log('Update error: ', error)
        next(error)
    }
})

//PUT api/animals/:id/status - állat aktiválása, deaktiválása - KÉSZ
app.put('/api/animals/:id/status', optionalAuth, roleCheck('employee', 'admin'), async (req, res, next) => {
    const animalId = Number(req.params.id)
    const { isActive } = req.body || {}
    if (!isActive) return res.status(400).json({ message: 'Hibás adatok' })
    const animal = await Animal.findByPk(animalId)
    if (!animal) return res.status(404).json({ message: 'Nincs ilyen ID-jú állat' })
    animal.isActive = isActive
    animal.save()
    await writeLog('ANIMAL_STATUS_CHANGE', 'Animal', animal.id, req.user.id)
    return res.status(200).json({ message: 'Sikeres módosítás' })
})

//PUT api/records/:id - csak vet módosíthatja
app.put('/api/records/:id', optionalAuth, roleCheck('vet'), async (req, res, next) => {
    const { description, weight, enclosure } = req.body || {}
    const recordId = Number(req.params.id)
    if (!description && typeof weight === 'undefined' && !enclosure) {
        return res.status(400).json({ message: 'Nincs frissítendő adat' })
    }
    const record = await MedicalRecord.findByPk(recordId)
    if (!record) {
        return res.status(404).json({ message: 'Orovsi bejegyzés nem található' })
    }
    const animal = await Animal.findByPk(animalId)
    if (!animalId) {
        return res.status(404).json({ message: 'A bejegyzéshez nem tartozik állat' })
    }
    if (description !== 'undefined') record.description = description
    if (weight !== 'undefined') {
        record.weight = weight
        animal.weight = weight
    }
    if (enclosure !== 'undefined') {
        record.enclosure = enclosure
        const encl = await Enclosure.findOne({ where: { name: enclosure } })
        if (!encl) {
            return res.status(404).json({ message: 'Módosítandó kifutó nem létezik' })
        }
        animal.enclosureId = encl.id
    }
    record.save()
    await writeLog('MEDICAL_RECORD_UPDATE', 'MedicalRecord', record.id, req.user.id)
    animal.save()
    return res.status(200).json({ message: 'Sikeres módosítás' })
})

// GET requests
// GET api/animal types - Állat típus lekérdezése - KÉSZ
app.get('/api/animaltypes', async (req, res) => {
    try {
        const items = await AnimalType.findAll({ order: [['id', 'ASC']] })
        res.json(items).end()
    } catch (error) {
        console.log('animaltypes error: ', error)
    }
})

// GET api/species - faj lekérdezése - KÉSZ
app.get('/api/species', async (req, res) => {
    try {
        const items = await Species.findAll({ order: [['id', 'ASC']] })
        res.json(items).end()
    } catch (error) {
        console.log('species error: ', error)
    }
})

// GET api/enclosure - kifutók lekérdezése KÉSZ
app.get('/api/enclosure', async (req, res) => {
    try {
        const items = await Enclosure.findAll({ order: [['id', 'ASC']] })
        res.json(items).end()
    } catch (error) {
        console.log('enclosure error: ', error)
    }
})

// GET api/animals - Vendég csak aktív, admin/employee/vet minden adatot, egyszrű szűrők query-ben - KÉSZ
app.get('/api/animals', optionalAuth, async (req, res, next) => {
    try {
        const { q, speciesId, typeId, enclosureId } = req.query
        const where = {}

        if (!req.user) where.isActive = true
        if (speciesId) where.speciesId = Number(speciesId)
        if (typeId) where.typeId = Number(typeId)
        if (enclosureId) where.enclosureId = Number(enclosureId)
        if (q && String(q).trim()) where.name = sequelize.where(sequelize.fn('lower', sequelize.col('name')), 'LIKE', `%${String(q).toLowerCase()}%`)

        const animal = await Animal.findAll({
            where,
            order: [['id', 'ASC']],
            include: [
                { model: Species, as: 'species', attributes: ['id', 'latinName'] },
                { model: AnimalType, as: 'type', attributes: ['id', 'name'] },
                { model: Enclosure, as: 'enclosure', attributes: ['id', 'name', 'description'] }
            ]
        });
        res.json(animal)
    } catch (error) {
        console.log('Get animals error: ', error);
        next(error)
    }
})

// GET api/animals/:id - Vendég csak aktív, admin/employee/vet minden adatot - KÉSZ
app.get('/api/animals/:id', optionalAuth, async (req, res, next) => {
    try {
        const where = { id: Number(req.params.id) }

        if (!req.user) where.isActive = true

        const animal = await Animal.findOne({
            where,
            include: [
                { model: Species, as: 'species', attributes: ['id', 'latinName'] },
                { model: AnimalType, as: 'type', attributes: ['id', 'name'] },
                { model: Enclosure, as: 'enclosure', attributes: ['id', 'name', 'description'] }
            ]
        });
        if (!animal) return res.status(404).json({ message: 'Állat nem található' })
        res.json(animal)
    } catch (error) {
        console.log('Get animals error: ', error);
        next(error)
    }
})

// GET api/logs - csak admin kérdezheti le - KÉSZ
app.get('/api/logs', optionalAuth, roleCheck('admin'), async (req, res, next) => {
    try {
        const logs = await Logs.findAll({ order: [['timestamp', 'DESC']], limit: 20 })
        res.status(200).json(logs)
    } catch (error) {
        console.log('Lekérdezési error: ', error)
        next(error)
    }
})



app.get('/api/animals/:id/records', optionalAuth, roleCheck('admin', 'vet'), async (req, res, next) => {
    try {
        const animalId = Number(req.params.id)
        if (animalId < 0) {
            return res.status(400).json({ message: 'Hibás id' })
        }
        const animal = await Animal.findByPk(animalId)
        if (!animal) {
            return res.status(404).json({ message: 'Nincs ilyen állat' })
        }
        const records = await MedicalRecord.findAll({
            where: { animalId },
            order: [['id', 'ASC']],
            include: [
                {
                    model: User,
                    as: 'vet',
                    attributes: ['id', 'name', 'email']
                }
            ]
        })
        console.log(records)
        if (!records) {
            return res.status(404).json({ message: 'A következő állathoz nincs orvosi bejegyzés' })
        }
        return res.status(200).json(records)
    } catch (error) {
        console.log('Get medical records: ', error)
        next(error)
    }
})


app.listen(PORT, async () => {
    await InitDB();
    console.log(`App running on http://localhost:${PORT}`);
});