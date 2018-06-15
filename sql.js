const { Pool } = require('pg')

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database : process.env.DB_NAME,
	password : process.env.DB_PASS,
	port: 5432
})

const createFactoriesTable = `
	CREATE TABLE IF NOT EXISTS FACTORIES(
		factory_id SERIAL PRIMARY KEY,
		name TEXT NOT NULL UNIQUE,
		max INT NOT NULL,
		min INT	NOT NULL,
		numChild INT NOT NULL,
		children INT[]
	);
	`

const saveFactory = async(factory) => {
	const query = `
	INSERT INTO factories (name,max,min,numChild,children)
	VALUES ($1,$2,$3,$4,$5)
	RETURNING *;
	`
	const { name, max, min, numChild, children } = {...factory}

	try {

		return dbResponse = await pool.query(query, [name,max,min,numChild,children])
		

	}catch(err) {
		console.log(dbResponse)
	}

}

const getAll = async() => {
	const query = `
		SELECT * 
		FROM factories;
	`

	try {
		const dbResponse = await pool.query(query)
		return dbResponse.rows

	}catch(err) {
		console.log(err)
	}
}

const update = async(factory) => {
	const query = `
		UPDATE factories SET
		name=($1), max=($2), min = ($3)
		WHERE factory_id = ($4);
	`

	const updatedChildren = `
		UPDATE factories SET
		children=($1)
		WHERE factory_id = ($2);

	`

	const { factory_id, name, max, min, children } = {...factory}

	console.log(factory)

	try {
		
		if (children) {

			const dbResponse = await pool.query(updatedChildren, [children, factory_id])
			return dbResponse.rows

		}else {

			const dbResponse = await pool.query(query,[name, max, min, factory_id])
			return dbResponse.rows
		}

		
	}catch (err) {
		console.log(err)
	}

}

const remove = async(factory) => {
	const query = `
		DELETE FROM factories
		WHERE factory_id = $1;
	`
	const { factory_id } = { ...factory }

	try {

		return dbResponse = await pool.query(query, [factory_id])

	}catch (err) {

	}
}

const prepareDB = (async() => {
	try {
		await pool.query(createFactoriesTable)
	}catch(err) {
		console.log(err)
	}
})


module.exports = {
	'prepareDB' : prepareDB,
	'saveFactory' : saveFactory,
	'getAll' : getAll,
	'update' : update,
	'remove' : remove,
}