import fse from 'fs-extra'
import Handlebars from 'handlebars';
import validator from 'validator';

// constants
const dirController = "./app/controllers/";
const dirRoute = "./app/routes/";
const dirEntity = "./app/entity/";
const templateRoute = "./template/templateRoute.txt";
const templateController = "./template/templateController.txt";
const templateEntity  = "./template/templateEntity.txt";

//get name of crud
let crudName = process.argv[2];

//verif name exist
if(!crudName || crudName === "" || !validator.isAlphanumeric(crudName)){
    console.log("Please select a valid name !")
    process.exit(1);
}

//constant about name of crud
crudName = crudName.toLowerCase();

console.log("génération CRUD et routes pour "+ crudName +" données");

const crudUp = crudName.charAt(0).toUpperCase() + crudName.substring(1);
const nameController = dirController + crudUp + ".ts";
const nameRoute = dirRoute +  crudUp + "Router.ts";
const nameEntity = dirEntity + crudUp + ".ts";

//verify if file exist and create it with a template
async function createFile(file, template, error){
    try{
        await fse.access(file, fse.constants.F_OK, async (err) => {
            if(!err){
                console.log(error)
                process.exit(1);
            }
            let data = fse.readFileSync(template, "utf8")
            const contents = Handlebars.compile(data)({upercase: crudUp, lowercase:crudName});
        
            await fse.writeFileSync(file, contents)         
        });
    }
    catch(e){
        console.log(e)
        if(e.code === "ERR_INVALID_ARG_TYPE")
            console.log("Problème de chemin de fichier")

        console.log("Une erreur est survenue, suppression de tous les fichiers :( ");

        fse.unlink(nameRoute);
        fse.unlink(nameController);
        fse.unlink(nameEntity);

        process.exit(1);
    }
}

//create file for controller, entity and route
createFile(nameRoute, templateRoute,"La route existe dejà !");
createFile(nameController, templateController,"Le controller existe dejà !")
createFile(nameEntity, templateEntity,"L'entité existe dejà !")

console.log("Success!")