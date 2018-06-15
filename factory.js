const sql = require('./sql')

//@index 
const index = async() => {
	//return all factories
	try {

		return response = await sql.getAll()

	}catch(err) {
		console.log(err)
	}
}

//@create
const create = async (factory) => {
	//save factory
	try {

		return response = await sql.saveFactory(factory)

	}catch(err) {

		console.log(err)

	}

}

//@update 
const update = async(factory) => {
	//update factory || update children generated
   	try {
		return response = await sql.update(factory)
   	}catch(err) {
   		console.log(err)
   	}

}

//@delete
const remove = async(factory) => {
	//delete factory
	try {
		return response = await sql.remove(factory)
	}catch(err) {
		console.log(err)
	}
}

module.exports = {
	'index' : index,
	'create' : create,
	'update' : update,
	'remove' : remove,
}
