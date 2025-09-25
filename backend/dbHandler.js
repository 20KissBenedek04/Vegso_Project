const { Sequelize, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')
require('dotenv').config()
// Környezeti változók
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_SYNC_FORCE = process.env.DB_SYNC_FORCE
const DB_SYNC_ALTER = process.env.DB_SYNC_ALTER
const DB_SYNC_SEED = process.env.DB_SYNC_SEED
const BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS

// Sequelize példány
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
    define: {
        charset: 'utf8mb4',
        underscored: true,
        collate: 'utf8mb4_unicode_ci'
    }
})


// modellek

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('guest', 'employee', 'vet', 'admin'), defaultValue: 'guest', allowNull: false }
})

const Animal = sequelize.define('Animal', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
    name: { type: DataTypes.STRING(255), allowNull: false },
    birthDate: { type: DataTypes.DATEONLY, allowNull: true, field: 'birth_date' },
    weight: { type: DataTypes.FLOAT, allowNull: true },
    imageURL: { type: DataTypes.STRING, allowNull: true, field: 'image_url' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, field: 'is_active' },
    //   speciesId: {type: DataTypes.INTEGER, allowNull: false},
    //   typeId: {type: DataTypes.INTEGER, allowNull: false},
    //   enclosureId: {type: DataTypes.INTEGER, allowNull: true}
})

const Species = sequelize.define('Species', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    latinName: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'latin_name' }
})

const AnimalType = sequelize.define('AnimalType', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
})

const Enclosure = sequelize.define('Enclosure', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: false }
})

const MedicalRecord = sequelize.define('MedicalRecord', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
    description: { type: DataTypes.STRING, allowNull: false },
    weight: {type: DataTypes.FLOAT, allowNull: false},
    enclosure: {type: DataTypes.STRING, allowNull: false},
    //vetId: { type: DataTypes.INTEGER, allowNull: false },
    //animalId: { type: DataTypes.INTEGER, allowNull: false }
})

const Logs = sequelize.define('Logs', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
    action: { type: DataTypes.STRING, allowNull: false },
    targetType: { type: DataTypes.STRING, allowNull: false },
    targetId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    timestamp: {type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW}
})



// kapcsolatok

Animal.belongsTo(Species, { as: 'species', foreignKey: { name: 'speciesId', field: 'species_id', allowNull: false }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Species.hasMany(Animal, { as: 'animals', foreignKey: { name: 'speciesId', field: 'species_id' } });

Animal.belongsTo(AnimalType, { as: 'type', foreignKey: { name: 'typeId', field: 'type_id', allowNull: false }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
AnimalType.hasMany(Animal, { as: 'animals', foreignKey: { name: 'typeId', field: 'type_id' } });

Animal.belongsTo(Enclosure, { as: 'enclosure', foreignKey: { name: 'enclosureId', field: 'eclosure_id', allowNull: true }, onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Enclosure.hasMany(Animal, { as: 'animals', foreignKey: { name: 'enclosureId', field: 'enclosure_id' } });

MedicalRecord.belongsTo(Animal, { as: 'animal', foreignKey: { name: 'animalId', field: 'animal_id', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Animal.hasMany(MedicalRecord, { as: 'records', foreignKey: { name: 'animalId', field: 'animal_id' } });

MedicalRecord.belongsTo(User, { as: 'vet', foreignKey: { name: 'vetId', field: 'vet_id', allowNull: false }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
User.hasMany(MedicalRecord, { as: 'vetRecords', foreignKey: { name: 'vetId', field: 'vet_id' } });


// inicializálás
async function InitDB() {
    // 1) kapcsolat
    await sequelize.authenticate();

    // 2) szinkron
    await sequelize.sync({
        force: DB_SYNC_FORCE,
        alter: DB_SYNC_ALTER
    });

    // --- USERS ---
    const userCount = await User.count();
    if (userCount === 0) {
        await User.bulkCreate([
            { name: 'Admin',     email: 'admin@zoo.local',     password: 'admin123',     role: 'admin' },
            { name: 'Employee1', email: 'employee1@zoo.local', password: 'employee123',  role: 'employee' },
            { name: 'Employee2', email: 'employee2@zoo.local', password: 'employee123',  role: 'employee' },
            { name: 'DoctorVet', email: 'vet1@zoo.local',      password: 'vet123',       role: 'vet' },
            { name: 'Guest',     email: 'guest@zoo.local',     password: 'guest123',     role: 'guest' }
        ]);
    }

    // --- ANIMAL TYPES ---
    const animalTypeCount = await AnimalType.count();
    if (animalTypeCount === 0) {
        await AnimalType.bulkCreate([
            { name: 'emlős' },
            { name: 'szárnyas' },
            { name: 'hüllő' },
            { name: 'kétéltű' }
        ]);
    }

    // --- SPECIES ---
    const speciesCount = await Species.count();
    if (speciesCount === 0) {
        await Species.bulkCreate([
            { latinName: 'Panthera leo' },
            { latinName: 'Elephas maximus' },
            { latinName: 'Aquila chrysaetos' },
            { latinName: 'Crocodylus niloticus' },
            { latinName: 'Gorilla beringei' },
            { latinName: 'Canis lupus' },
            { latinName: 'Python regius' }
        ]);
    }

    // --- ENCLOSURES ---
    const enclosureCount = await Enclosure.count();
    if (enclosureCount === 0) {
        await Enclosure.bulkCreate([
            { name: 'Hüllőház',     description: 'Meleg, párás tér, sziklás terep' },
            { name: 'Madárház',     description: 'Ágas fák, tágas röptető' },
            { name: 'Szavanna',     description: 'Meleg, nyílt térség' },
            { name: 'Nagyemlős-kifutó', description: 'Tágas füves terület, vízforrás' }
        ]);
    }

    // --- ANIMALS ---
    const animalCount = await Animal.count();
    if (animalCount === 0) {
        const types = await AnimalType.findAll({ order: [['id', 'ASC']] });
        const species = await Species.findAll({ order: [['id', 'ASC']] });
        const encls = await Enclosure.findAll({ order: [['id', 'ASC']] });

        const [emlos, szarnyas, hullo, keteltu] = types;
        const [leo, elephas, aquila, croc, gorilla, wolf, python] = species;
        const [reptileHouse, birdsHouse, savanna, bigMammals] = encls;

        await Animal.bulkCreate([
            { name: 'Simba',       speciesId: leo.id,     typeId: emlos.id,   enclosureId: savanna.id,    birthDate: '2020-01-01', weight: 130,   isActive: true,  imageURL: null },
            { name: 'Nala',        speciesId: leo.id,     typeId: emlos.id,   enclosureId: savanna.id,    birthDate: '2020-06-12', weight: 118,   isActive: true,  imageURL: null },
            { name: 'Dumbo',       speciesId: elephas.id, typeId: emlos.id,   enclosureId: bigMammals.id, birthDate: '2018-02-02', weight: 3000,  isActive: true,  imageURL: null },
            { name: 'Matilda',     speciesId: elephas.id, typeId: emlos.id,   enclosureId: bigMammals.id, birthDate: '2017-11-20', weight: 3200,  isActive: true,  imageURL: null },
            { name: 'Eagle Eye',   speciesId: aquila.id,  typeId: szarnyas.id,enclosureId: birdsHouse.id, birthDate: '2023-03-03', weight: 6.5,   isActive: true,  imageURL: null },
            { name: 'Gold Wing',   speciesId: aquila.id,  typeId: szarnyas.id,enclosureId: birdsHouse.id, birthDate: '2022-04-14', weight: 7.2,   isActive: true,  imageURL: null },
            { name: 'Crocodile',   speciesId: croc.id,    typeId: hullo.id,   enclosureId: reptileHouse.id,birthDate: '2021-05-25', weight: 12,    isActive: false, imageURL: null },
            { name: 'Gina',        speciesId: gorilla.id, typeId: emlos.id,   enclosureId: bigMammals.id, birthDate: '2019-09-09', weight: 160,   isActive: true,  imageURL: null },
            { name: 'Luna',        speciesId: wolf.id,    typeId: emlos.id,   enclosureId: savanna.id,    birthDate: '2022-12-01', weight: 45,    isActive: true,  imageURL: null },
            { name: 'Slyther',     speciesId: python.id,  typeId: hullo.id,   enclosureId: reptileHouse.id,birthDate: '2020-08-18', weight: 9.3,   isActive: true,  imageURL: null }
        ]);
    }

    // --- MEDICAL RECORDS ---
    const mrCount = await MedicalRecord.count();
    if (mrCount === 0) {
        const vet = await User.findOne({ where: { role: 'vet' } });
        const animals = await Animal.findAll({ order: [['id', 'ASC']] });

        if (vet && animals.length > 0) {
            const now = new Date();
            const days = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

            // Példák: különböző állatok, súly/kifutó megjegyzéssel
            await MedicalRecord.bulkCreate([
                { description: 'Általános ellenőrzés, jó kondíció',   weight: 131.2, enclosure: 'Szavanna',        animalId: animals[0].id, vetId: vet.id, createdAt: days(30), updatedAt: days(30) },
                { description: 'Kisebb lábsérülés kezelése',          weight: 117.5, enclosure: 'Szavanna',        animalId: animals[1].id, vetId: vet.id, createdAt: days(21), updatedAt: days(21) },
                { description: 'Súlymérés, etetési terv beállítása',  weight: 3005,  enclosure: 'Nagyemlős-kifutó',animalId: animals[2].id, vetId: vet.id, createdAt: days(14), updatedAt: days(14) },
                { description: 'Röptető átvizsgálás, tollazat rendben',weight: 6.6,  enclosure: 'Madárház',        animalId: animals[4].id, vetId: vet.id, createdAt: days(10), updatedAt: days(10) },
                { description: 'Prevenciós vizsgálat, terrárium oké', weight: 12.4,  enclosure: 'Hüllőház',        animalId: animals[6].id, vetId: vet.id, createdAt: days(7),  updatedAt: days(7) },
                { description: 'Fogászati kontroll',                  weight: 161.1, enclosure: 'Nagyemlős-kifutó',animalId: animals[7].id, vetId: vet.id, createdAt: days(5),  updatedAt: days(5) },
                { description: 'Súlymérés, jó kondíció',              weight: 45.2,  enclosure: 'Szavanna',        animalId: animals[8].id, vetId: vet.id, createdAt: days(3),  updatedAt: days(3) }
            ]);
        }
    }

    // --- LOGS ---
    const logsCount = await Logs.count();
    if (logsCount === 0) {
        const admin = await User.findOne({ where: { role: 'admin' } });
        const vet = await User.findOne({ where: { role: 'vet' } });
        const animals = await Animal.findAll({ order: [['id', 'ASC']] });

        const stamp = (n) => new Date(Date.now() - n * 60 * 60 * 1000); // n óra ezelőtt

        const logs = [];

        // Animal create / update példa (admin)
        if (admin && animals.length >= 3) {
            logs.push(
                { action: 'ANIMAL_CREATE', targetType: 'Animal', targetId: animals[0].id, userId: admin.id, timestamp: stamp(72) },
                { action: 'ANIMAL_CREATE', targetType: 'Animal', targetId: animals[1].id, userId: admin.id, timestamp: stamp(70) },
                { action: 'ANIMAL_UPDATE', targetType: 'Animal', targetId: animals[1].id, userId: admin.id, timestamp: stamp(48) }
            );
        }

        // Medical record create/update példa (vet)
        if (vet && animals.length >= 5) {
            logs.push(
                { action: 'MEDICAL_RECORD_CREATE', targetType: 'MedicalRecord', targetId: 1, userId: vet.id, timestamp: stamp(40) },
                { action: 'MEDICAL_RECORD_CREATE', targetType: 'MedicalRecord', targetId: 2, userId: vet.id, timestamp: stamp(30) },
                { action: 'MEDICAL_RECORD_UPDATE', targetType: 'MedicalRecord', targetId: 2, userId: vet.id, timestamp: stamp(20) }
            );
        }

        if (logs.length > 0) {
            await Logs.bulkCreate(logs);
        }
    }
}


module.exports = {
    sequelize,
    InitDB,
    User,
    Animal,
    AnimalType,
    MedicalRecord,
    Species,
    Logs,
    Enclosure
}