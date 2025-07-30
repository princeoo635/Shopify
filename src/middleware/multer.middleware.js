import multer from 'multer'
const storage=multer.diskStorage({
    distination:function(req,file,cb){
        cb(null,"./public/temp")
    },
    filename:function(req,file,cb){
        cb(null,'file.orininalname')
    }
})

export const upload=multer({storage})