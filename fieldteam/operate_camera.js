/*
 * This class is the parent class of job_index_view.js
 */

Titanium.include('transaction.js');
function operate_camera_page(){
        var self = this;
        self.window_source = 'operate_camera_page';
}
    
//get parent class's prototype object
var FA = function(){};
FA.prototype = transaction_page.prototype;
operate_camera_page.prototype = new FA();
operate_camera_page.prototype.constructor = operate_camera_page;
operate_camera_page.prototype.cameraOverLay = null;
operate_camera_page.prototype.currentMediaType = '';
operate_camera_page.prototype.selectedMediaType = '';
operate_camera_page.prototype.mediaFileArray = [];
operate_camera_page.prototype.smallImageWidth = 640;//set width with ipad minmum width
operate_camera_page.prototype.showCameraInfos = {};
operate_camera_page.prototype.capturingVideo = false;
operate_camera_page.prototype.videoTimerHandlder = null;
operate_camera_page.prototype.videoTimerLeft = 0;
operate_camera_page.prototype.cameraTabGroup = null;
operate_camera_page.prototype.cameraTab = null;
/*
 * setup overlay for camera
 * we can add custom controls on overlay
 */
operate_camera_page.prototype.setupOverLay=function(){           
        var self = this;     
        try{
                self.parentOverLay = Ti.UI.createView({
                        width:'auto',
                        height:'auto'
                });
                self.tempOverLay = Ti.UI.createView({
                        opacity:0,
                        backgroundColor:'#000'
                });
                self.parentOverLay.add(self.tempOverLay);
                var flexSpace = Titanium.UI.createButton({
                        systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
                });
                
                self.flashOnOff = Ti.UI.createImageView({
                        image:self.get_file_path('image','camera/flash_auto.png'),
                        width:32,
                        height:32
                });                 
                
                self.fileNumberLabel = Titanium.UI.createLabel({
                        text:'Files:[0/'+self.max_number_camera_take_photo_or_video+']',
                        height:32,
                        width:150,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                        font:{
                                fontSize:self.font_size,
                                fontWeight:self.font_weight
                        }                        
                });                 
                                                                 
                self.cameraSwitchBtn = Ti.UI.createImageView({
                        image:self.get_file_path('image','camera/black-switch-camera-32.png'),
                        width:32,
                        height:32
                });
                
                self.top_tool_bar = Ti.UI.iOS.createToolbar({
                        items:(Ti.Media.availableCameras.length > 1)?[self.flashOnOff,flexSpace,self.fileNumberLabel,flexSpace,self.cameraSwitchBtn]:[self.flashOnOff,flexSpace,self.fileNumberLabel,flexSpace],
                        top:0,
                        barColor:'#fff',
                        borderTop:false,
                        borderBottom:false,
                        opacity:0.5
                });                                 
                self.parentOverLay.add(self.top_tool_bar);               
                
                self.cancelBtn = Ti.UI.createImageView({
                        left:10,
                        image:self.get_file_path('image','camera/cancel.png'),
                        width:50,
                        height:50,
                        bottom:25
                });                                 
                                                                  
                self.captureBtn = Ti.UI.createImageView({
                        left:(self.screen_width/2-40),
                        image:self.get_file_path('image',(self.selectedMediaType == 'photo')?'camera/camera_normal.png':'camera/video_normal.png'),
                        width:72,
                        height:72,
                        bottom:14
                });
                
                self.videoTimerLabel = Titanium.UI.createLabel({
                        right:10,
                        text:'[00:00:00]',
                        height:48,
                        width:100,
                        bottom:26,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                        font:{
                                fontSize:self.font_size,
                                fontWeight:self.font_weight
                        },
                        visible:false
                });                
                
                self.mediaTypeBtn = Ti.UI.createImageView({
                        right:10,
                        image:self.get_file_path('image',(self.selectedMediaType == 'photo')?'camera/video_switch.png':'camera/camera_switch.png'),
                        width:48,
                        height:48,
                        bottom:26
                });                
              
                self.bottom_tool_bar = Ti.UI.createView({
                        backgroundColor:'#fff',
                        height:100,
                        width:'auto',
                        bottom:0,
                        opacity:0.8
                });
                self.bottom_tool_bar.add(self.cancelBtn);
                self.bottom_tool_bar.add(self.captureBtn);
                self.bottom_tool_bar.add(self.videoTimerLabel);
                if(self.currentMediaType == ''){
                        self.bottom_tool_bar.add(self.mediaTypeBtn);
                }
                
                self.flashOnOff.addEventListener('click',function(e){
                        if (Ti.Media.cameraFlashMode == Ti.Media.CAMERA_FLASH_AUTO)
                        {
                                self.flashOnOff.image = self.get_file_path('image','camera/flash_on.png');
                                Ti.Media.cameraFlashMode = Ti.Media.CAMERA_FLASH_ON;
                        }
                        else if (Ti.Media.cameraFlashMode == Ti.Media.CAMERA_FLASH_ON)
                        {
                                self.flashOnOff.image = self.get_file_path('image','camera/flash_off.png');
                                Ti.Media.cameraFlashMode = Ti.Media.CAMERA_FLASH_OFF;
                        }
                        else
                        {
                                self.flashOnOff.image = self.get_file_path('image','camera/flash_auto.png');
                                Ti.Media.cameraFlashMode = Ti.Media.CAMERA_FLASH_AUTO;
                        }
                });                   
                
                self.cameraSwitchBtn.addEventListener('click',function(e){
                        if(Ti.Media.availableCameras.length > 1){
                                if(Ti.Media.camera ==Ti.Media.CAMERA_REAR){
                                        Ti.Media.switchCamera(Ti.Media.CAMERA_FRONT);
                                }else{
                                        Ti.Media.switchCamera(Ti.Media.CAMERA_REAR);
                                }
                        }
                });       
                
                self.mediaTypeBtn.addEventListener('click',function(e){  
                        self.display_indicator('Loading Camera...');
                        self.tempOverLay.opacity = 1;
                        if(self.selectedMediaType == 'photo'){
                                self.captureBtn.image = self.get_file_path('image','camera/video_normal.png');
                                self.mediaTypeBtn.image = self.get_file_path('image','camera/camera_switch.png');
                                Ti.Media.mediaTypes = Ti.Media.MEDIA_TYPE_VIDEO;
                                Ti.Media.setAvailableCameraMediaTypes(Ti.Media.MEDIA_TYPE_VIDEO);
                                self.selectedMediaType = 'video';
                        }else{                    
                                self.captureBtn.image = self.get_file_path('image','camera/camera_normal.png');
                                self.mediaTypeBtn.image = self.get_file_path('image','camera/video_switch.png');
                                Ti.Media.mediaTypes = Ti.Media.MEDIA_TYPE_PHOTO;
                                Ti.Media.setAvailableCameraMediaTypes(Ti.Media.MEDIA_TYPE_PHOTO);
                                self.selectedMediaType = 'photo';                                
                        }
                        Ti.Media.hideCamera();
                        setTimeout(function(){      
                                Ti.API.info('abc1');
                                self.process_camera_action(); 
                                Ti.API.info('abc2');
                                self.tempOverLay.opacity = 0;
                                self.hide_indicator();
                        },2000);//here must be set 1 second, otherwise camera can't reopen                             
                });
                self.cancelBtn.addEventListener('click',function(e){
                        if(self.capturingVideo){
                                if(self.selectedMediaType == 'video'){
                                        Titanium.Media.stopVideoCapture();
                                }
                                self.capturingVideo = false;                                        
                        }     
                        Ti.Media.hideCamera();
                        if(self.mediaFileArray.length > 0){
                                self.displayFilesAfterTake('from_camera');                                   
                        }else{                                
                                self.hide_indicator();
                                self.mediaFileArray = [];    
                                Titanium.UI.currentWindow.fireEvent('focus'); 
                        }
                });    
                
                self.captureBtn.addEventListener('touchstart',function(e){                   
                        if(self.selectedMediaType == 'photo'){
                                self.captureBtn.image = self.get_file_path('image','camera/camera_click.png');                            
                        }else{
                                self.captureBtn.image = self.get_file_path('image','camera/video_record.png');
                        }
                });
                
                self.captureBtn.addEventListener('touchend',function(e){
                        if(self.selectedMediaType == 'photo'){
                                self.captureBtn.image = self.get_file_path('image','camera/camera_normal.png');
                        }else{
                                self.captureBtn.image = self.get_file_path('image','camera/video_normal.png'); 
                        }
                });                
                
                self.captureBtn.addEventListener('click',function(e){
                        if(self.mediaFileArray.length >= self.max_number_camera_take_photo_or_video){
                                self.show_message(L('message_arrive_max_number_on_take_photo_or_video'));
                                return;
                        }                            
                        if(self.selectedMediaType == 'photo'){
                                self.captureBtn.image = self.get_file_path('image','camera/camera_click.png');
                                self.tempOverLay.opacity = 1;
                                Ti.Media.takePicture();                     
                        }else{
                                if(!self.capturingVideo){
                                        self.top_tool_bar.setVisible(false);
                                        self.cancelBtn.setVisible(false);
                                        self.mediaTypeBtn.setVisible(false); 
                                        self.videoTimerLabel.setVisible(true); 
                                        self.videoTimerLabel.text = '[00:00:00]';
                                        self.captureBtn.image = self.get_file_path('image','camera/video_record.png');
                                        Ti.Media.startVideoCapture();
                                        self.videoTimerSeconds = 0, self.videoTimerMinutes = 0, self.videoTimerHours = 0;
                                        self.capturingVideo = true;
                                        self.videoTimerHandlder = setInterval(function(){                                                
                                                if((self.videoTimerHours*3600+self.videoTimerHours*60+self.videoTimerSeconds) > 90){
                                                        self.capturingVideo = false;
                                                        self.top_tool_bar.setVisible(true);
                                                        self.cancelBtn.setVisible(true);
                                                        self.mediaTypeBtn.setVisible(true); 
                                                        self.videoTimerLabel.setVisible(false); 
                                                        Ti.Media.stopVideoCapture();     
                                                        if(self.videoTimerHandlder != null){
                                                                clearInterval(self.videoTimerHandlder);
                                                                self.videoTimerHandlder = null;
                                                        }
                                                        self.fileNumberLabel.text = 'Files:['+self.mediaFileArray.length+'/'+self.max_number_camera_take_photo_or_video+']';                                                        
                                                }
                                                self.videoTimerSeconds++;
                                                if(self.videoTimerSeconds > 59){
                                                        self.videoTimerMinutes++;
                                                        self.videoTimerSeconds = 0;
                                                        if(self.videoTimerMinutes > 59){
                                                                self.videoTimerHours++;
                                                                self.videoTimerMinutes = 0;
                                                        }
                                                }                                                
                                                self.videoTimerLabel.text = '['+((self.videoTimerHours<10)?'0'+self.videoTimerHours:self.videoTimerHours)+':'+((self.videoTimerMinutes<10)?'0'+self.videoTimerMinutes:self.videoTimerMinutes)+':'+((self.videoTimerSeconds<10)?'0'+self.videoTimerSeconds:self.videoTimerSeconds)+']';
                                        },1000);                                        
                                }else{                                        
                                        self.capturingVideo = false;
                                        self.top_tool_bar.setVisible(true);
                                        self.cancelBtn.setVisible(true);
                                        self.mediaTypeBtn.setVisible(true); 
                                        self.videoTimerLabel.setVisible(false); 
                                        self.captureBtn.image = self.get_file_path('image','camera/video_normal.png');
                                        Ti.Media.stopVideoCapture();     
                                        if(self.videoTimerHandlder != null){
                                                clearInterval(self.videoTimerHandlder);
                                                self.videoTimerHandlder = null;
                                        }
                                        self.fileNumberLabel.text = 'Files:['+self.mediaFileArray.length+'/'+self.max_number_camera_take_photo_or_video+']';
                                }                                
                        }
                        if(self.selectedMediaType == 'photo'){
                                setTimeout(function(){
                                        self.captureBtn.image = self.get_file_path('image','camera/camera_normal.png');
                                        self.tempOverLay.opacity = 0;                                
                                },500);      
                        }
                });                      
                self.parentOverLay.add(self.bottom_tool_bar);
        }catch(err){
                if(self.videoTimerHandlder != null){
                        clearInterval(self.videoTimerHandlder);
                        self.videoTimerHandlder = null;
                }                
                self.process_simple_error_message(err,self.window_source+' - operate_camera_page.prototype.setupOverLay');
        }
};
/*
 *  process media file after take photos or videos
 *  create thumbnail image
 *  save all images
 */
operate_camera_page.prototype.process_media = function(){
        var self = this;
        try{
                
                var file_folder = self.file_directory+self.showCameraInfos.company_id+'/'+self.showCameraInfos.type+'/'+self.showCameraInfos.job_reference_number+'/'+self.showCameraInfos.asset_type_path;
                var login_user_name = Ti.App.Properties.getString('current_login_user_name');                 
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');          
                var db = Titanium.Database.open(self.get_db_name());
                db.execute('BEGIN');
                for(var i=0,j=self.mediaFileArray.length;i<j;i++){ 
                        if(self.mediaFileArray[i].object == undefined || self.mediaFileArray[i].object == null){
                                continue;
                        }                        
                        if(i>0){
                                self.update_message('Processing Files ['+(i+1)+'/'+self.mediaFileArray.length+'] ...');
                        }
                        //                        if(self.mediaFileArray[i].extension == 'jpg'){
                        //                                if(self.mediaFileArray[i].object.width > self.smallImageWidth){
                        //                                        self.mediaFileArray[i].object = self.mediaFileArray[i].object.imageAsResized(self.smallImageWidth,(self.mediaFileArray[i].object.height*self.smallImageWidth/self.mediaFileArray[i].object.width));
                        //                                }                                
                        //                                self.mediaFileArray[i].thumb_object = self.mediaFileArray[i].object.imageAsResized(self.default_thumb_image_width,(self.mediaFileArray[i].object.height*self.default_thumb_image_width/self.mediaFileArray[i].object.width));
                        //                        }else{
                        //                                if(self.mediaFileArray[i].extension == 'mp4'){
                        //                                        var movie = Titanium.Media.createVideoPlayer({
                        //                                                media:self.mediaFileArray[i].object,
                        //                                                scalingMode:Titanium.Media.VIDEO_SCALING_ASPECT_FILL,
                        //                                                width:self.default_thumb_image_width,
                        //                                                height:self.default_thumb_image_width*self.screen_height/self.screen_width,
                        //                                                visible:false
                        //                                        });
                        //                                        self.mediaFileArray[i].thumb_object = movie.thumbnailImageAtTime(1, Titanium.Media.VIDEO_TIME_OPTION_EXACT);
                        //                                }
                        //                        }
                        try{
                                var imageFile = Ti.Filesystem.getFile(file_folder,self.mediaFileArray[i].file_id+"."+self.mediaFileArray[i].extension);
                                imageFile.write(self.mediaFileArray[i].object); 
                                if(self.mediaFileArray[i].thumb_object != null){
                                        var thumbImageFile = Ti.Filesystem.getFile(file_folder,'thumb_'+self.mediaFileArray[i].file_id+".jpg");
                                        thumbImageFile.write(self.mediaFileArray[i].thumb_object);                                         
                                }
                        }catch(e){
                                continue;
                        }
                        var create_date_string = self.get_date_string_by_milliseconds(self.mediaFileArray[i].file_id);
                        var path = self.showCameraInfos.company_id+'/'+self.showCameraInfos.type+'/'+self.showCameraInfos.job_reference_number+'/'+self.showCameraInfos.asset_type_path+'/'+self.mediaFileArray[i].file_id+"."+self.mediaFileArray[i].extension;
                        db.execute('INSERT INTO my_'+self.showCameraInfos.type+'_asset (id,local_id,'+self.showCameraInfos.type+'_id,'+self.showCameraInfos.type+'_asset_type_code,name,description,'+
                                'path_original,path,mime_type,width,height,file_size,status_code,is_local_record,changed)'+
                                'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                self.mediaFileArray[i].file_id,
                                self.showCameraInfos.company_id+'-'+_selected_user_id+'-'+self.mediaFileArray[i].file_id,
                                self.showCameraInfos.job_id,
                                self.showCameraInfos.asset_type_code,
                                (self.mediaFileArray[i].extension == 'jpg')?'New Photo':'New Video',
                                'Created by '+login_user_name+' on '+create_date_string,
                                path,
                                path,
                                (self.mediaFileArray[i].extension == 'jpg')?'image/jpeg':'video/mp4',
                                self.mediaFileArray[i].object.width,
                                self.mediaFileArray[i].object.height,
                                self.mediaFileArray[i].object.length,
                                1,1,
                                1);                    
                }
                db.execute('COMMIT');
                db.close();                
        }catch(err){                
                self.process_simple_error_message(err,self.window_source+' - operate_camera_page.prototype.process_media');
        }finally{
                if(self.videoTimerHandlder != null){
                        clearInterval(self.videoTimerHandlder);
                        self.videoTimerHandlder = null;
                }
                setTimeout(function(){
                        self.hide_indicator();
                        self.mediaFileArray = [];    
                        Titanium.UI.currentWindow.fireEvent('focus');                         
                },1000);

        }
};
/*
 *  execute take photo or video action
 */
operate_camera_page.prototype.process_camera_action = function(){
        var self = this;
        try{    
                
                Titanium.Media.showCamera({                       
                        success:function(event){
                                if(!self.create_directory(self.showCameraInfos.company_id+'/'+self.showCameraInfos.type+'/'+self.showCameraInfos.job_reference_number+'/'+self.showCameraInfos.asset_type_path)){
                                        self.show_message(L('message_failure_create_folder'));
                                        return;
                                }
                                
                                var tempObject = event.media;
                                var tempThumbObject = null;
                                if(self.selectedMediaType == 'photo'){
                                        if(tempObject.width > self.smallImageWidth){
                                                tempObject = tempObject.imageAsResized(self.smallImageWidth,(tempObject.height*self.smallImageWidth/tempObject.width));
                                        }                                
                                        tempThumbObject = tempObject.imageAsResized(self.default_thumb_image_width,(tempObject.height*self.default_thumb_image_width/tempObject.width));                                        
                                }else{
                                        var movie = Titanium.Media.createVideoPlayer({
                                                media:tempObject,
                                                scalingMode:Titanium.Media.VIDEO_SCALING_ASPECT_FILL,
                                                width:self.default_thumb_image_width,
                                                height:self.default_thumb_image_width*self.screen_height/self.screen_width,
                                                visible:false,
                                                autoplay:false
                                        });                                        
                                        tempThumbObject = movie.thumbnailImageAtTime(1, Titanium.Media.VIDEO_TIME_OPTION_EXACT);                                                                                
                                }                                   
                                var temp_var = {
                                        extension:(self.selectedMediaType == 'photo')?'jpg':'mp4',
                                        object:tempObject,
                                        thumb_object:tempThumbObject,
                                        file_id:parseInt(new Date().getTime(),10)
                                };
                             
                                if(self.selectedMediaType == 'video'){
                                        Titanium.Media.saveToPhotoGallery(event.media);
                                }
                                self.mediaFileArray.push(temp_var);  
                                self.fileNumberLabel.text = 'Files:['+self.mediaFileArray.length+'/'+self.max_number_camera_take_photo_or_video+']';
                                self.hide_indicator();  
                        },
                        cancel:function(){
                                if(self.selectedMediaType == 'photo'){
                                        self.captureBtn.image = self.get_file_path('image','camera/camera_normal.png'); 
                                }                                
                                if(self.capturingVideo){
                                        if(self.selectedMediaType == 'video'){
                                                self.captureBtn.image = self.get_file_path('image','camera/video_normal.png');
                                                Titanium.Media.stopVideoCapture();
                                                if(self.videoTimerHandlder != null){
                                                        clearInterval(self.videoTimerHandlder);
                                                        self.videoTimerHandlder = null;
                                                }                                                
                                        }
                                        self.capturingVideo = false;                                        
                                }                                
                                self.hide_indicator();  
                                //fire focus event because close camera doesn't refresh page
                                Titanium.UI.currentWindow.fireEvent('focus');
                        },
                        error:function(e){
                                // set message
                                self.hide_indicator();  
                                if (e.code == Titanium.Media.NO_CAMERA){
                                        self.show_message('No camera on this device');
                                        return;
                                }else{
                                        if(self.selectedMediaType == 'photo'){
                                                self.captureBtn.image = self.get_file_path('image','camera/camera_normal.png'); 
                                        }                       
                                        if(self.capturingVideo){
                                                if(self.selectedMediaType == 'video'){
                                                        self.captureBtn.image = self.get_file_path('image','camera/video_normal.png');
                                                        Titanium.Media.stopVideoCapture();
                                                        if(self.videoTimerHandlder != null){
                                                                clearInterval(self.videoTimerHandlder);
                                                                self.videoTimerHandlder = null;
                                                        }                                                        
                                                }
                                                self.capturingVideo = false;                                        
                                        }  
                                        self.show_message('Failed to capture '+self.selectedMediaType+'.');
                                        return;
                                }
                        },
                        animated:true,
                        transform: Titanium.UI.create2DMatrix().scale(1),
                        overlay:self.parentOverLay,
                        saveToPhotoGallery:true,
                        autohide:false, 
                        allowEditing:false,
                        showControls:false,
                        videoQuality:Titanium.Media.QUALITY_MEDIUM,//Ti.Media.QUALITY_640x480,
                        videoMaximumDuration:self.maximum_video_length,//1.5 minute,90 seconds
                        mediaTypes:(self.selectedMediaType == 'photo')?Ti.Media.MEDIA_TYPE_PHOTO:Ti.Media.MEDIA_TYPE_VIDEO
                });
        }catch(err){
                if(self.videoTimerHandlder != null){
                        clearInterval(self.videoTimerHandlder);
                        self.videoTimerHandlder = null;
                }                
                self.hide_indicator();  
                self.process_simple_error_message(err,self.window_source+' - operate_camera_page.prototype.process_camera_action');
                return;
        }        
};
/*
 * open camera for take photo or video
 * display overlay view
 */
operate_camera_page.prototype.show_camera = function(media_type,job_id,job_reference_number,company_id,type,asset_type_path,asset_type_code){
        var self = this;
        try{
                Ti.API.info('currentMediaType1 :'+media_type);
                self.currentMediaType = media_type;                
                self.selectedMediaType = (media_type == '')?'photo':media_type;
                Ti.API.info('selectedMediaType :'+self.selectedMediaType);
                self.showCameraInfos = {
                        job_id:job_id,
                        job_reference_number:job_reference_number,
                        company_id:company_id,
                        type:type,
                        asset_type_path:asset_type_path,
                        asset_type_code:asset_type_code
                };                
                self.setupOverLay();                
                self.process_camera_action();
        }catch(err){
                if(self.videoTimerHandlder != null){
                        clearInterval(self.videoTimerHandlder);
                        self.videoTimerHandlder = null;
                }                
                self.hide_indicator();  
                self.process_simple_error_message(err,self.window_source+' - operate_camera_page.prototype.show_camera');
                return;
        }
};

/*
 *  execute take photo or video action
 */
operate_camera_page.prototype.process_photo_library_action = function(){
        var self = this;
        try{    
                var mediaTypes = [Ti.Media.MEDIA_TYPE_PHOTO,Ti.Media.MEDIA_TYPE_VIDEO];
                switch(self.selectedMediaType){
                        case 'photo':
                                mediaTypes = [Ti.Media.MEDIA_TYPE_PHOTO];
                                break;
                        case 'video':
                                mediaTypes = [Ti.Media.MEDIA_TYPE_VIDEO];
                                break;
                        default:
                }                
                Titanium.Media.openPhotoGallery({
                        success:function(event){
                                if(!self.create_directory(self.showCameraInfos.company_id+'/'+self.showCameraInfos.type+'/'+self.showCameraInfos.job_reference_number+'/'+self.showCameraInfos.asset_type_path)){
                                        self.show_message(L('message_failure_create_folder'));
                                        return;
                                }
                                self.display_indicator('Processing File...');
                                var tempObject = event.media;
                                var tempThumbObject = null;
                                if(event.mediaType === Ti.Media.MEDIA_TYPE_PHOTO){
                                        if(tempObject.width > self.smallImageWidth){
                                                tempObject = tempObject.imageAsResized(self.smallImageWidth,(tempObject.height*self.smallImageWidth/tempObject.width));
                                        }                                
                                        tempThumbObject = tempObject.imageAsResized(self.default_thumb_image_width,(tempObject.height*self.default_thumb_image_width/tempObject.width));                                        
                                }else{
                                        var movie = Titanium.Media.createVideoPlayer({
                                                media:tempObject,
                                                scalingMode:Titanium.Media.VIDEO_SCALING_ASPECT_FILL,
                                                width:self.default_thumb_image_width,
                                                height:self.default_thumb_image_width*self.screen_height/self.screen_width,
                                                visible:false,
                                                autoplay:false
                                        });                                        
                                        tempThumbObject = movie.thumbnailImageAtTime(1, Titanium.Media.VIDEO_TIME_OPTION_EXACT);                                                                                
                                }                                   
                                var temp_var = {
                                        extension:(event.mediaType === Ti.Media.MEDIA_TYPE_PHOTO)?'jpg':'mp4',
                                        object:tempObject,
                                        thumb_object:tempThumbObject,
                                        file_id:parseInt(new Date().getTime(),10)
                                };
                                self.mediaFileArray.push(temp_var);                              
                                self.process_media();
                        },
                        cancel:function(){
                        //                                if(self.mediaFileArray.length > 0){
                        //                                        self.displayFilesAfterTake('from_library');                                   
                        //                                }else{                                
                        //                                        self.mediaFileArray = [];    
                        //                                        Titanium.UI.currentWindow.fireEvent('focus'); 
                        //                                }                                
                        },
                        error:function(error){
                        },
                        allowEditing:false,
                        autohide:true,
                        mediaTypes:mediaTypes                        
                });
        }catch(err){               
                self.hide_indicator();  
                self.process_simple_error_message(err,self.window_source+' - operate_camera_page.prototype.process_photo_library_action');
                return;
        }        
};

/*
 * open photo gallery for take photo or video
 */
operate_camera_page.prototype.show_library = function(media_type,job_id,job_reference_number,company_id,type,asset_type_path,asset_type_code){
        var self = this;
        try{              
                if (Titanium.Platform.model == 'google_sdk' || Titanium.Platform.model == 'Simulator' || Titanium.Platform.model == 'x86_64'){
                        self.test_library('',job_id,job_reference_number,company_id,type,asset_type_path,asset_type_code);
                        return;
                }
                self.currentMediaType = media_type;                
                self.selectedMediaType = (media_type == '')?'':media_type;                
                self.showCameraInfos = {
                        job_id:job_id,
                        job_reference_number:job_reference_number,
                        company_id:company_id,
                        type:type,
                        asset_type_path:asset_type_path,
                        asset_type_code:asset_type_code
                };                
                self.process_photo_library_action();
        }catch(err){
                self.hide_indicator();  
                self.process_simple_error_message(err,self.window_source+' - operate_camera_page.prototype.show_library');
                return;
        }
};

/*
 *  allow user to reorder, delete and save taked photos or videos
 */
operate_camera_page.prototype.displayFilesAfterTake = function(from_source){
        var self = this;
        try{            
                var tempThumbnailWidth = 100;
                var spaceWidthBetweenThumbnail = ((self.screen_width-2*10-3*tempThumbnailWidth)/2);
                var selectMediaFileWin = Titanium.UI.createWindow({
                        title:'Select Media Files',
                        backgroundColor:'#fff',
                        animate : true
                });              
                var flexSpace = Titanium.UI.createButton({
                        systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
                });      
                var cameraBtn = null;
                if(from_source == 'from_camera'){
                        cameraBtn = Titanium.UI.createButton({
                                systemButton:Titanium.UI.iPhone.SystemButton.CAMERA
                        });  
                }else{
                        cameraBtn = Titanium.UI.createButton({
                                title:'Take More'
                        });
                }
                var bottom_tool_bar = Ti.UI.iOS.createToolbar({
                        items:[flexSpace,cameraBtn,flexSpace],
                        bottom:0,
                        borderColor:self.tool_bar_color_in_ios_7,
                        borderWidth:1,
                        zIndex:100,
                        opacity:0.8
                });
                selectMediaFileWin.add(bottom_tool_bar);                   
                
                cameraBtn.addEventListener('click',function(){
                        if(self.mediaFileArray.length >= self.max_number_camera_take_photo_or_video){
                                self.show_message(L('message_arrive_max_number_on_take_photo_or_video'));
                                return;
                        }
                        self.fileNumberLabel.text = 'Files:['+self.mediaFileArray.length+'/'+self.max_number_camera_take_photo_or_video+']';
                        selectMediaFileWin.close();
                        if(from_source == 'from_camera'){
                                self.process_camera_action();      
                        }else{
                                self.process_photo_library_action();
                        }
                });                            

                //save button
                var saveBtn = Titanium.UI.createButton({
                        systemButton:Titanium.UI.iPhone.SystemButton.SAVE
                });
                saveBtn.addEventListener('click', function(){   
                        selectMediaFileWin.close();
                        if(self.mediaFileArray.length > 0){
                                self.display_indicator('Processing Files [1/'+self.mediaFileArray.length+'] ...');
                                self.process_media(); 
                        }
                });
                selectMediaFileWin.setRightNavButton(saveBtn);  
                //selectMediaFileWin.rightNavButton = saveBtn;
                
                var closeBtn = Titanium.UI.createButton({
                        title:'Close',
                        font:{
                                fontWeight:self.font_weight
                        }                         
                });
                selectMediaFileWin.setLeftNavButton(closeBtn);  
                closeBtn.addEventListener('click', function(){
                        var optionDialog = Ti.UI.createOptionDialog({
                                options:(self.is_ipad())?['YES','NO','Cancel','']:['YES','NO','Cancel'],
                                buttonNames:['Cancel'],
                                destructive:0,
                                cancel:2,
                                title:'Do you want to save media files?'
                        });
                        optionDialog.show();
                        optionDialog.addEventListener('click',function(e){
                                switch(e.index){
                                        case 0://Yes
                                                saveBtn.fireEvent('click');       
                                                break;
                                        case 1://No
                                                self.mediaFileArray= [];
                                                Ti.Media.hideCamera();
                                                selectMediaFileWin.close();                                        
                                                break;
                                        default:
                                                return;
                                }
                        });                          
                });        
                                   
                
                var selectMediaView = Titanium.UI.createView({ 
                        top:20,                     
                        width:self.screen_width,
                        height:'auto'
                });  
                for(var r=0;r<3;r++){//row
                        for(var c=0;c<3;c++){//column
                                if(self.mediaFileArray[3*r+c] != undefined && self.mediaFileArray[3*r+c] != null){
                                        var container = Ti.UI.createView({
                                                filterClass:'container',  
                                                mediaIndex:3*r+c,
                                                top:(r==0)?20:(20+r*40+r*tempThumbnailWidth),
                                                height : tempThumbnailWidth,
                                                width : tempThumbnailWidth,
                                                left:(c==0)?10:(10+spaceWidthBetweenThumbnail*c+tempThumbnailWidth*c)
                                        });   
                                        var imageThumb = Ti.UI.createImageView({
                                                filterClass:'imageThumb',
                                                mediaIndex:3*r+c,
                                                image : self.mediaFileArray[3*r+c].thumb_object,
                                                width : 90,
                                                height : 90,
                                                top : 5
                                        });
                                        container.add(imageThumb);
                                        var removeImageBtn = Ti.UI.createImageView({
                                                filterClass:'remove',
                                                mediaIndex:3*r+c,
                                                container:container,
                                                image : self.get_file_path('image','button-cancel-icon.png'),
                                                width : 25,
                                                height : 25,
                                                top : 0,
                                                right:0
                                        });
                                        container.add(removeImageBtn);
                                        container.add(Ti.UI.createLabel({
                                                filterClass:'label',
                                                mediaIndex:3*r+c,
                                                text : self.mediaFileArray[3*r+c].extension=='jpg'?'Photo':'Video',
                                                font:{
                                                        fontWeight:self.font_weight
                                                },                                                   
                                                backgroundColor:'#000',
                                                width:90,
                                                height:20,
                                                bottom:0,
                                                opacity:0.5,
                                                color:'#fff',
                                                textAlign:'center'                                                                                                                              
                                        }));
                                        container.addEventListener('click',function(e){
                                                try{
                                                        if(e.source.filterClass == 'remove'){
                                                                var containerChildrenNum = e.source.container.children.length;
                                                                for(var i=containerChildrenNum-1;i>=0;i--){
                                                                        if(e.source.container.children[i] != undefined || e.source.container.children[i] != null){
                                                                                e.source.container.remove(e.source.container.children[i]);
                                                                        }
                                                                }
                                                                self.mediaFileArray.splice(e.source.mediaIndex,1);  
                                                        }else{
                                                                if(e.source.filterClass == 'imageThumb'){
                                                                        bottom_tool_bar.setVisible(false);
                                                                        selectMediaFileWin.fullscreen = true;
                                                                        var transform = Ti.UI.create2DMatrix().scale(0);
                                                                        var view = Ti.UI.createView({
                                                                                transform:transform,
                                                                                opacity:0,
                                                                                top:0,
                                                                                left:0,
                                                                                height:self.screen_height,
                                                                                width:self.screen_width
                                                                        });
                                                                        var displayViewer = null;
                                                                        if(self.mediaFileArray[e.source.mediaIndex].extension == 'jpg'){
                                                                                displayViewer = Titanium.UI.createImageView({
                                                                                        image:self.mediaFileArray[e.source.mediaIndex].object,
                                                                                        width:self.screen_width,
                                                                                        height:self.screen_height
                                                                                }); 
                                                                        }else{
                                                                                displayViewer = Titanium.Media.createVideoPlayer({
                                                                                        media:self.mediaFileArray[e.source.mediaIndex].object,
                                                                                        scalingMode:Titanium.Media.VIDEO_SCALING_ASPECT_FILL
                                                                                });                                        
                                                                        }
                                                                        view.add(displayViewer);                               
                                                                        selectMediaFileWin.add(view);
                                                                        var animation = Ti.UI.createAnimation();
                                                                        animation.left = 0;
                                                                        animation.right = 0;
                                                                        animation.top = 0;
                                                                        animation.bottom = 0;
                                                                        animation.width = self.screen_width;
                                                                        animation.height = self.screen_height;
                                                                        animation.opacity = 1;
                                                                        animation.duration = 500;
                                                                        animation.transform = Ti.UI.create2DMatrix();
                                                                        view.animate(animation);
                                                                        displayViewer.addEventListener('click',function(){      
                                                                                view.animate({
                                                                                        opacity:0,
                                                                                        duration:400
                                                                                },function(){
                                                                                        if(self.mediaFileArray[e.source.mediaIndex].extension == 'mp4'){
                                                                                                displayViewer.stop();
                                                                                        }
                                                                                        selectMediaFileWin.fullscreen = false;
                                                                                        selectMediaFileWin.remove(view);
                                                                                        bottom_tool_bar.setVisible(true);
                                                                                        
                                                                                        selectMediaFileWin.leftNavButton = closeBtn;
                                                                                        selectMediaFileWin.rightNavButton = saveBtn;
                                                                                        selectMediaFileWin.title = 'Select Media Files';      
                                                                                });
                                                                        });
                                                                }
                                                        }
                                                }
                                                catch(E)
                                                {
                                                        Ti.API.error("ERROR = "+E);
                                                }                                                
                                        });
                                        selectMediaView.add(container);
                                }
                        }                       
                }
                selectMediaFileWin.add(selectMediaView);                
                Ti.UI.currentTab.open(selectMediaFileWin,{
                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                });
        }catch(err){               
                self.process_simple_error_message(err,self.window_source+' - operate_camera_page.prototype.displayFilesAfterTake');
                return;
        }        
};


operate_camera_page.prototype.test_library = function(media_type,job_id,job_reference_number,company_id,type,asset_type_path,asset_type_code){
        var self = this;
        try{
                var file_folder = self.file_directory+company_id+'/'+type+'/'+job_reference_number+'/'+asset_type_path;
                Ti.API.info('file_folder:'+file_folder);
                var login_user_name = Ti.App.Properties.getString('current_login_user_name');
                var file_extension = 'jpg';
                var file_id = new Date().getTime();
                var create_date_string = self.get_date_string_by_milliseconds(file_id);
                var file_id_num = file_id;
                file_id = job_reference_number+'_'+file_id_num;
                var exist_image = false;
                var exist_video = false;
                var oldFile = null;
                switch(asset_type_path){
                        case 'photo':
                        case 'work-order':
                                file_extension = 'jpg';
                                oldFile = Ti.Filesystem.getFile(self.file_directory,'1.'+file_extension);
                                if(oldFile.exists()){
                                        exist_image = true;
                                }
                                break;
                        default:
                                file_extension = 'mp4';
                                oldFile = Ti.Filesystem.getFile(self.file_directory,'1.'+file_extension);
                                if(oldFile.exists()){
                                        exist_video = true;
                                }
                }
                if((!exist_image)&&(!exist_video)){
                        return;
                }
                
                var blobOfImage = oldFile.read();

                // Put it in a imageView, since It wont let me get height from a blob for some reason
                var imageView1 = Titanium.UI.createImageView({
                        image: blobOfImage,
                        width: 'auto',
                        height: 'auto'
                });

                // This is the important part, toImage this view and you get the height and width of this image
                // For some reason we cant get this from a Blob in SDK 2.1.1.GA
                var heightOfImage = imageView1.toImage().height;
                var widthOfImage = imageView1.toImage().width;
                Ti.API.info('heightOfImage:'+heightOfImage);
                Ti.API.info('widthOfImage:'+widthOfImage);
                var aspectRatio =  heightOfImage / widthOfImage;
                Ti.API.info('aspectRatio:'+aspectRatio);
                var newWidth = 640;
                var newHeight = 0;
                if(!self.create_directory(company_id+'/'+type+'/'+job_reference_number+'/'+asset_type_path)){
                        self.show_message(L('message_failure_create_folder'));
                }                
                if (widthOfImage > 640) {
                        newHeight = newWidth*aspectRatio;                        
                        Ti.API.info('Resizing image from ' + widthOfImage + ', ' + heightOfImage + ' to ' + newWidth + ', ' + newHeight);
                        newHeight = parseInt(newHeight,10);
                        Ti.API.info('newHeight:'+newHeight);
                }else{
                        newWidth = widthOfImage;
                        newHeight = heightOfImage;
                }               
                var smallImage = blobOfImage.imageAsResized(newWidth,newHeight);
                Ti.API.info('Got small image. Writing to file.');
                var newFile = Ti.Filesystem.getFile(file_folder,file_id+"."+file_extension);
                var file_size = 0;
                if(newFile.write(smallImage)){
                        file_size = newFile.size;
                }
                Ti.API.info('Finished writing small image to file.');               
                
                
                //var oldFileBlob = oldFile.toBlob();
                Ti.API.info('resize image');
                if(exist_image){
                        Ti.API.info('resize image2');
                        self.get_resized_image(file_id+"."+file_extension,'thumb',job_reference_number,company_id,type,asset_type_path);//create thumb image
                        self.get_resized_image(file_id+"."+file_extension,'resized',job_reference_number,company_id,type,asset_type_path);//create a resized image, fit the device size
                }
                
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var db = Titanium.Database.open(self.get_db_name());
                db.execute('INSERT INTO my_'+type+'_asset (id,local_id,'+type+'_id,'+type+'_asset_type_code,name,description,'+
                        'path_original,path,mime_type,width,height,file_size,status_code,is_local_record,changed)'+
                        'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                        file_id_num,
                        _selected_company_id+'-'+_selected_user_id+'-'+file_id_num,
                        job_id,
                        asset_type_code,
                        (file_extension === 'jpg')?'New Photo':'New Video',
                        'Created by '+login_user_name+' on '+create_date_string,
                        (job_id > 1000000000)?company_id+'/'+type+'/'+job_reference_number+'/'+asset_type_path+'/'+file_id+"."+file_extension:company_id+'/'+type+'/'+job_reference_number+'/'+asset_type_path+'/'+file_id+"."+file_extension,
                        (job_id > 1000000000)?company_id+'/'+type+'/'+job_reference_number+'/'+asset_type_path+'/'+file_id+"."+file_extension:company_id+'/'+type+'/'+job_reference_number+'/'+asset_type_path+'/'+file_id+"."+file_extension,
                        (file_extension === 'jpg')?'image/jpeg':'video/mp4',
                        newWidth,
                        newHeight,
                        file_size,
                        1,1,
                        1);
                db.close();                   
                var mime_type = (file_extension === 'jpg')?'image/jpeg':'video/mp4';
                self.checkFileSizeIsOverLimitOrNot(mime_type,file_size);
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - operate_camera_page.prototype.test_library');
                return;
        }
};
operate_camera_page.prototype.set_image_to_landscape = function(media,origin_file_name,job_reference_number,company_id,type,asset_type_path,width,height){
        var self = this;
        try{
                var file_folder = self.file_directory+company_id+'/'+type+'/'+job_reference_number+'/'+asset_type_path;
                var newImageView = Titanium.UI.createImageView({
                        transform: Ti.UI.create2DMatrix().rotate(90)
                });
                newImageView.image = media;
                newImageView.width = parseInt(width, 10);
                newImageView.height = parseInt(height, 10);
                var blob = newImageView.toImage();
                blob = blob.imageAsResized(width,height);
                var new_porait_image = Ti.Filesystem.getFile(file_folder,origin_file_name);
                new_porait_image.write(blob);
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - operate_camera_page.prototype.set_image_to_landscape');
                return;
        }
};
operate_camera_page.prototype.get_resized_image = function(origin_file_name,image_type,job_reference_number,company_id,type,asset_type_path){
        var self = this;
        try{
                var file_folder = self.file_directory+company_id+'/'+type+'/'+job_reference_number+'/'+asset_type_path;
                var origin_image = Ti.Filesystem.getFile(file_folder,origin_file_name);
                if(!origin_image.exists()){
                        return;
                }
                var blob = origin_image.toBlob();
                var nWidth = (image_type === 'thumb')?self.default_thumb_image_width:(self.screen_width-100);
                if(blob.width <= nWidth){
                }else{
                        var nHeight = (blob.height / blob.width) * nWidth;
                        if(nHeight > (self.screen_height-100)){
                                nWidth = (blob.width / blob.height) * nHeight;
                        }
                        var reducedImageView = Titanium.UI.createImageView({});
                        reducedImageView.image = blob ;
                        reducedImageView.width = parseInt(nWidth, 10);
                        reducedImageView.height = parseInt(nHeight, 10);
                        blob = reducedImageView.toImage();
                }
                var resized_image = Ti.Filesystem.getFile(file_folder,image_type+'_'+origin_file_name);
                resized_image.write(blob);
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - operate_camera_page.prototype.get_resized_image');
                return;
        }
};
operate_camera_page.prototype.download_job_thubnail_image = function(responseText){
        return;
//            var result = JSON.parse(Titanium.App.Properties.getString('databaseInfo'));
//            if((result === null)||(result.JobAsset === undefined)||(result.JobAsset === null)){
//                return;
//            }else{
//                for(var i=0,j=result.JobAsset.length-1;i<j;i++){
//                    if(result.JobAsset[i].mime_type === 'image/jpeg'){
//                        if((result.JobAsset[i].path != '')){
//                            var temp_array = result.JobAsset[i].path.spilt('/');
//                            var _file_name = temp_array[temp_array.length-1];
//                            var _file_folder = self.file_directory;
//                            var _file_folder_url = self.file_base_url;
//                            for(var m=0,n=temp_array.length-2;m<n;m++){
//                                _file_folder +='/'+temp_array[m];
//                                _file_folder_url += '/'+temp_array[m]+'/';
//                            }
//                            var thub_nail_name_array = _file_name.split('_');
//                            var thub_nail_file_name = '';
//                            for(var b=0,c=thub_nail_name_array.length-1;b<c;b++){
//                                if(self.is_ipad()){
//                                    if(b === thub_nail_name_array.length-1){
//                                        thub_nail_file_name+=thub_nail_name_array[b]+'_114*114'+thub_nail_name_array[thub_nail_name_array.length-1];
//                                    }else{
//                                        thub_nail_file_name+=thub_nail_name_array[b]+'_';
//                                    }
//                                }else{
//                                    if(b === thub_nail_name_array.length-1){
//                                        thub_nail_file_name+=thub_nail_name_array[b]+'_57*57'+thub_nail_name_array[thub_nail_name_array.length-1];
//                                    }else{
//                                        thub_nail_file_name+=thub_nail_name_array[b]+'_';
//                                    }
//                                }
//                            }
//                            var asset_obj = Ti.Filesystem.getFile(_file_folder,thub_nail_file_name);
//                            if(!asset_obj.exists()){
//                                (function(){
//                                    var xhr = null;
//                                    if(self.set_enable_keep_alive){
//                                        xhr = Ti.Network.createHTTPClient({enableKeepAlive:false});
//                                    }else{
//                                        xhr = Ti.Network.createHTTPClient();
//                                    }
//                                    xhr.onload = function(){
//                                        try{
//                                            if((xhr.readyState === 4)&&(this.status === 200)){
//                                                var media_obj = Ti.Filesystem.getFile(_file_folder,_file_name);
//                                                media_obj.write(this.responseData);
//                                            }
//                                        }catch(e){
//                                        }
//                                    };
//                                    xhr.ondatastream = function(e){
//                                    };
//                                    xhr.onerror = function(e){
//                                    };
//                                    xhr.open('GET',_file_folder_url+_file_name);
//                                    xhr.send();
//                                }());
//                            }
//                        }
//                    }
//                }
//            }
};
operate_camera_page.prototype.download_quote_thubnail_image = function(responseText){
        return;
//            var result = JSON.parse(Titanium.App.Properties.getString(responseText));
//            if((result === null)||(result.QuoteAsset === undefined)||(result.QuoteAsset === null)){
//                return;
//            }else{
//                for(var i=0,j=result.QuoteAsset.length;i<j;i++){
//                    if(result.QuoteAsset[i].mime_type === 'image/jpeg'){
//                        if((result.QuoteAsset[i].path != NULL)||((result.QuoteAsset[i].path != ''))){
//                            var temp_array = result.QuoteAsset[i].path.spilt('/');
//                            var _file_name = temp_array[temp_array.length-1];
//                            var _file_folder = self.file_directory;
//                            var _file_folder_url = self.file_base_url;
//                            for(var m=0,n=temp_array.length-2;m<n;m++){
//                                _file_folder +='/'+temp_array[m];
//                                _file_folder_url += '/'+temp_array[m]+'/';
//                            }
//                            var thub_nail_name_array = _file_name.split('_');
//                            var thub_nail_file_name = '';
//                            for(var b=0,c=thub_nail_name_array.length-1;b<c;b++){
//                                if(self.is_ipad()){
//                                    if(b === thub_nail_name_array.length-1){
//                                        thub_nail_file_name+=thub_nail_name_array[b]+'_114*114'+thub_nail_name_array[thub_nail_name_array.length-1];
//                                    }else{
//                                        thub_nail_file_name+=thub_nail_name_array[b]+'_';
//                                    }
//                                }else{
//                                    if(b === thub_nail_name_array.length-1){
//                                        thub_nail_file_name+=thub_nail_name_array[b]+'_57*57'+thub_nail_name_array[thub_nail_name_array.length-1];
//                                    }else{
//                                        thub_nail_file_name+=thub_nail_name_array[b]+'_';
//                                    }
//                                }
//                            }
//                            var asset_obj = Ti.Filesystem.getFile(_file_folder,thub_nail_file_name);
//                            if(!asset_obj.exists()){
//                                (function(){
//                                    var xhr = null;
//                                    if(self.set_enable_keep_alive){
//                                        xhr = Ti.Network.createHTTPClient({enableKeepAlive:false});
//                                    }else{
//                                        xhr = Ti.Network.createHTTPClient();
//                                    }
//                                    xhr.onload = function(){
//                                        try{
//                                            if((xhr.readyState === 4)&&(this.status === 200)){
//                                                var media_obj = Ti.Filesystem.getFile(_file_folder,_file_name);
//                                                media_obj.write(this.responseData);
//                                            }
//                                        }catch(e){
//                                        }
//                                    };
//                                    xhr.ondatastream = function(e){
//                                    };
//                                    xhr.onerror = function(e){
//                                    };
//                                    xhr.open('GET',_file_folder_url+_file_name);
//                                    xhr.send();
//                                }());
//                            }
//                        }
//                    }
//                }
//            }
};
operate_camera_page.prototype.checkFileSizeIsOverLimitOrNot = function(mime_type,file_size){
        var self = this;
        try{
                var temp_upload_is_over_limit = false;
                switch(mime_type){
                        case 'image/jpeg':
                                if(file_size > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_image'),10)){
                                        temp_upload_is_over_limit = true;
                                }
                                if(temp_upload_is_over_limit){
                                        var maxImageSize = parseInt(parseInt(Titanium.App.Properties.getString('app_media_upload_limit_image'),10)/(1024*1000),10);
                                        var alertDialog = Titanium.UI.createAlertDialog({
                                                title:'Reminder',
                                                message:'This photo is over size. Max uploading size is '+maxImageSize+'M',
                                                buttonNames:['Close']
                                        });
                                        alertDialog.show();                                                         
                                }
                                break;
                        case 'video/mp4':
                                if(file_size > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_video'),10)){
                                        temp_upload_is_over_limit = true;
                                }  
                                if(temp_upload_is_over_limit){
                                        maxImageSize = parseInt(parseInt(Titanium.App.Properties.getString('app_media_upload_limit_video'),10)/(1024*1000),10);
                                        alertDialog = Titanium.UI.createAlertDialog({
                                                title:'Reminder',
                                                message:'This video is over size. Max uploading size is '+maxImageSize+'M',
                                                buttonNames:['Close']
                                        });
                                        alertDialog.show();                                                         
                                }                                                
                                break;
                }        
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - operate_camera_page.prototype.checkFileSizeIsOverLimitOrNot');
                return;
        }
};
