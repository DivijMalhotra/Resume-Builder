import Resume from '../models/resumeModel.js'
import fs from 'fs'
import path from 'path'

export const createResume = async(req,res) => {
    try {
        const {title} = req.body

        //Default Template
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };

        const newResume = await Resume.create({
            userId: req.user._id,
            title,
            ...defaultResumeData,
            ...req.body
        })
        res.status(201).json(newResume)
        

    } catch (error) {
        res.status(500).json({
            message: "Failed to create resume",
            error: error.message
        })
    }
}



//GET FUNCTION 
export const getUserResumes = async (req,res) => {
    try {
        const resumes = await Resume.find({userId: req.user._id}).sort({
        updatedAt: -1   
    })
    res.json(resumes)

    } catch (error) {
        res.status(500).json({
            message: "Failed to get resume",
            error: error.message
        })
    }
}


//GET RESUME BY ID
export const getResumeById = async(req,res) => {
    try {
        const resume = await Resume.findOne({_id: req.params.id, userId: req.user._id})
        if (!resume){
            res.status(404).json({ message: "Resume not Found"})
        }
        res.json(resume)

    } catch (error) {
        res.status(500).json({
            message: "Failed to get resume by ID",
            error: error.message
        })
    }
}


//UPDATE RESUME
export const updateResume = async(req,res) => {
    try {
        const resume = await Resume.findOne({_id: req.params.id, userId: req.user._id})
        if (!resume){
            res.status(404).json({ message: "Resume not Found or not authorized"})
        }
        
        //MERGE UPDATED RESUMES
        Object.assign(resume, req.body)
        
        //SAVE UPDATED RESUMES
        const savedResumes = await resume.save()
        res.json(savedResumes)

    } catch (error) {
        res.status(500).json({
            message: "Failed to update resume",
            error: error.message
        })
    }
}


//DELETE RESUME 
export const deleteResume = async (req,res) => {
    try {
        const resume = await Resume.findOne({_id: req.params.id, userId: req.user._id})
        if (!resume){
            res.status(404).json({ message: "Resume not Found"})
        }

        //CREATE A UPLOADS FOLDER AND STORE THE RESUME THERE
        const uploadsFolder = path.join(process.cwd(), 'uploads')

        //DELETE THUMBNAIL LINK
        if (resume.thumbnailLink){
            const oldThumbnailLink = path.join(uploadsFolder, path.basename(resume.thumbnailLink))
            if (fs.existsSync(oldThumbnailLink)){
                fs.unlinkSync(oldThumbnailLink)
            }
        }

        //DELETE PROFILE INFO
        if (resume.profileInfo?.previewUrl){
            const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.previewUrl))
            if (fs.existsSync(oldProfile)){
                fs.unlinkSync(oldProfile)
            }
        }

        //DELETE RESUME DOCUMENT
        const deleted = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        })
        if (!deleted){
            res.status(404).json({ message: "Resume not Found or not authorized"})
        }

        res.json({message: "Resume deleted successfully"})

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete resume",
            error: error.message
        })
    }
}