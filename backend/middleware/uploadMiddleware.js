import multer from 'multer'

//STORAGE CONFIGURATION - 1) Where to store files , 2) How to name them
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, "uploads/")  //Saves the file in the uploads folder
    },
    filename: (req,file,cb) => {    //Generates a unique file name
        cb(null, `${Date.now()} - ${file.originalname}`)   
    },
})


//FILE FILTER
const fileFilter = (req,file,cb) => {
    const allowedTypes = ["image/jpg" , "image/jpeg", "image/png"]
    if (allowedTypes.includes(file.mimetype)){        //Used to check if the mime type is valid or not
        cb(null, true)
    }
    else {
        cb(new Error("Only .jpg .jpeg .png are allowed formats"), false)
    }
}

const upload = multer({storage, fileFilter})   //Creates the actual upload middleware
export default upload;
