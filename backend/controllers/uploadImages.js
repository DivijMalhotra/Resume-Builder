import fs from 'fs'
import path from 'path'

import Resume from '../models/resumeModel.js'
import upload from '../middleware/uploadMiddleware.js'
import { error, profile } from 'console'


export const uploadResumeImages = async(req,res) => {
    try {
        //CONFIGURE MULTER TO HANDLE IMAGES
        upload.fields([{ name: "thumbnail"}, {name : "profileImage"}])   //MULTER ACCEPTS TWO DIFFERENT FILE FIELDS
        (req,res, async(err) => {
            if (err){
                return res.status(400).json({message: "File upload failed" , error: err.message})
            }

            const resumeId = req.params.id
            const resume = await Resume.findOne({_id: resumeId , userId: req.user._id})
            
            if (!resume){
                return res.status(404).message({message: "Resume not found or not authorized"})
            }

            //USE PROCESS CWD TO LOCATE UPLOADS FOLDER
            const uploadsFolder = path.join(process.cwd(), "uploads")
            const baseUrl = `${req.protocol}://${req.get("host")}`

            const newThumbnail = req.files.thumbnail?.[0]      //GETS UPLOADED THUMBNAIL FILE IF PRESENT
            const newProfileImage = req.files.profileImage?.[0]    //GETS UPLOADED PROFILE IMAGE FILE  IF PRESENT

            if (newThumbnail){
                if (resume.thumbnailLink){
                    const oldThumbnailLink = path.join(uploadsFolder, path.basename(resume.thumbnailLink))
                    if (fs.existsSync(oldThumbnailLink)){
                        fs.unlinkSync(oldThumbnailLink)
                    }
                }
                resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`
            }

            if (newProfileImage){
                if (resume.profileInfo?.profilePreviewUrl){
                    const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl))
                    if (fs.existsSync(oldProfile)){
                        fs.unlinkSync(oldProfile)
                    }
                }
                resume.profileInfo.profilePreviewUrl =  `${baseUrl}/uploads/${newProfileImage.filename}`
            }

            await resume.save()
            res.status(201).json({
                message: "Images uploaded successfully",
                thumbnailLink: resume.thumbnailLink,
                profilePreviewUrl: resume.profileInfo.profilePreviewUrl
            })

        })
        
    } catch (err) {
        console.error("Error uploading images", err)
        res.status(400).json({
            message: "Failed to upload images",
            error: err.message
        })
    }
}

