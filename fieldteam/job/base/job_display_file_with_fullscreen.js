/**
 *  Description: browse file
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_base_display_file_with_fullscreen_page_obj = null;

        function job_base_display_file_with_fullscreen_page(){
                var self = this;
                var window_source = 'job_base_display_file_with_fullscreen_page';
                win.title = 'Display File';

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                 
                self.init = function(){
                        try{          
                                //self.init_auto_release_pool(win);
                                //call init_navigation_bar function of parent class: fieldteam.js
                                //self.init_navigation_bar('Close','');    
                                _display();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }                        
                };                 

                //private member
                var _asset_mime_type = win.asset_mime_type;
                var _media_url = win.media_url;

                //private method
                /**
                 *  display file . if file not exist then download it.
                 */
                function _display(){
                        try{
                                switch(_asset_mime_type){
                                        case 'image'://photo
                                                _play_photo();
                                                break;
                                        case 'video'://document
                                                _play_video();
                                                break;
                                        case 'audio'://audio
                                                _play_audio();
                                                break;
                                        default:
                                                _play_pdf();
                                                break;
                                }      
                                _add_close_btn();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display');
                                return;
                        }                                
                }           
                /** 
                 *  display photo
                 */
                function _play_photo(){
                        try{
                                var asset_obj = Ti.Filesystem.getFile(_media_url);
                                var baseHeight = asset_obj.toBlob().height;
                                var baseWidth = asset_obj.toBlob().width;
                                var asset_view = Ti.UI.createImageView({
                                        backgroundColor:'#000',
                                        height:self.screen_width*baseHeight/baseWidth,
                                        width:self.screen_width,
                                        image:_media_url
                                });
                                win.add(asset_view);
                                asset_view.addEventListener('pinch', function(e) {
                                        if(asset_view.baseWidth * e.scale < self.screen_width){
                                                asset_view.width = self.screen_width;
                                                asset_view.height = self.screen_width*baseHeight/baseWidth;
                                        }else{                                                                                                                     
                                                asset_view.height = asset_view.baseHeight * e.scale;
                                                asset_view.width = asset_view.baseWidth * e.scale;
                                        }
                                }); 
                                asset_view.addEventListener('touchstart', function(e) {
                                        asset_view.baseHeight = asset_view.height;
                                        asset_view.baseWidth = asset_view.width;
                                });  
                                                                                                        
                                asset_view.addEventListener('doubletap', function(e){
//                                        var t = Titanium.UI.create2DMatrix();
//                                        var a = Titanium.UI.createAnimation();
//                                        if (!asset_view.scaled){
//                                                t = t.scale(2.0);                                                                
//                                                a.center = {
//                                                        x:e.x, 
//                                                        y:e.y
//                                                };
//                                                asset_view.scaled = true;
//                                        }else{
//                                                t = t.scale(1.0);
//                                                asset_view.scaled = false;
//                                        }
//                                        a.transform = t;
//                                        a.duration = 400;
//                                        asset_view.animate(a);
                                });                                                                        
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _play_photo');
                                return;
                        }                                
                }
                /** 
                 *  display pdf
                 */                
                function _play_pdf(){
                        try{
                                var asset_view = Ti.UI.createWebView({
                                        bottom:0,
                                        scalespageToFilt:true,
                                        url:_media_url
                                });
                                win.add(asset_view);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _play_pdf');
                                return;
                        }                                
                }
                /** 
                 *  display audio
                 */                
                function _play_audio(){
                        try{
                                if (Titanium.Media.audioPlaying) {
                                        Titanium.Media.audioSessionMode = Titanium.Media.AUDIO_SESSION_MODE_AMBIENT;
                                }
                                var audio_obj = Titanium.Filesystem.getFile(_media_url);
                                self.audio = Titanium.Media.createSound({
                                        url:audio_obj.nativePath,
                                        allowBackground:false
                                });  

                                self.is_pause = false;
                                self.label = Titanium.UI.createLabel({
                                        text:'',
                                        top:self.screen_height/2-150,
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        },
                                        textAlign:'center',
                                        width:200,
                                        height:30
                                });
                                win.add(self.label);
                                self.play_btn = Titanium.UI.createButton({
                                        backgroundColor:'blue',
                                        borderRadius:3,
                                        color:'#fff',
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        },
                                        title:'Play',
                                        width:200,
                                        height:40,    
                                        left:(self.screen_width-200)/2,
                                        top:self.screen_height/2-80
                                });
                                win.add(self.play_btn);
                                self.pause_btn = Titanium.UI.createButton({
                                        backgroundColor:'blue',
                                        borderRadius:3,
                                        color:'#fff',
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        },
                                        title:'Pause',
                                        width:200,
                                        height:40,       
                                        left:(self.screen_width-200)/2,
                                        top:self.screen_height/2-80
                                });
                                win.add(self.pause_btn);
                                self.pause_btn.visible = false;
                                self.stop_btn = Titanium.UI.createButton({
                                        backgroundColor:'blue',
                                        borderRadius:3,
                                        color:'#fff',
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        },
                                        title:'Stop',
                                        width:200,
                                        height:40,    
                                        left:(self.screen_width-200)/2,
                                        top:self.screen_height/2+10
                                });
                                win.add(self.stop_btn);                               
                                
                                self.stop_btn.visible = false;

                                self.play_btn.addEventListener('click',function(){
                                        self.audio.play();
                                        self.play_btn.visible = false;
                                        self.pause_btn.visible = true;
                                        self.stop_btn.visible = true;
                                });
                                self.pause_btn.addEventListener('click',function(){
                                        if(self.is_pause){
                                                self.audio.play();
                                                self.play_btn.visible = false;
                                                self.pause_btn.visible = true;
                                        }else{
                                                self.audio.pause();
                                                self.play_btn.visible = true;
                                                self.pause_btn.visible = false;
                                        }
                                });
                                self.stop_btn.addEventListener('click',function(){
                                        self.label.text = '';
                                        self.audio.stop();
                                        self.play_btn.visible = true;
                                        self.pause_btn.visible = false;
                                        self.stop_btn.visible = false;
                                });
                                self.audio.addEventListener('complete', function(){
                                        self.label.text = '';
                                        self.play_btn.visible = true;
                                        self.pause_btn.visible = false;
                                        self.stop_btn.visible = false;
                                });                            
                                self.audio_interval = setInterval(function(){
                                        if (self.audio.isPlaying()){
                                                self.label.text = 'Playing '+parseInt(self.audio.time/1000,10)+'s of '+parseInt(self.audio.duration,10)+'s';
                                        }
                                },500);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _play_audio');
                                return;
                        }                                
                }
                /** 
                 *  display video
                 */                
                function _play_video(){
                        try{
                                self.activeMovie = Titanium.Media.createVideoPlayer({
                                        url:_media_url,
                                        movieControlMode: Titanium.Media.VIDEO_CONTROL_DEFAULT,
                                        scalingMode:Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
                                        autoplay:true
                                }); 
                                win.add(self.activeMovie);                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _play_video');
                                return;
                        }                                
                }
                
                function _add_close_btn(){
                        try{
                                var closeBtn = Titanium.UI.createButton({
                                        title:'Close',
                                        top:20,
                                        right:10,
                                        width:80,
                                        height:40,
                                        border:1
                                }); 
                                closeBtn.addEventListener('click',function(e){
                                        if(_asset_mime_type =='audio' && self.audio_interval != undefined && self.audio_interval != null){
                                                self.audio.stop();
                                                clearInterval(self.audio_interval);  
                                        }
                                        if(_asset_mime_type =='video' && self.activeMovie != undefined && self.activeMovie != null){
                                                self.activeMovie.stop();
                                        }
                                        win.close();
                                });
                                win.add(closeBtn);                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _play_video');
                                return;
                        }                         
                }
        }

        win.addEventListener('open',function(){
                try{
                        if(job_base_display_file_with_fullscreen_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_display_file_with_fullscreen_page.prototype = new F();
                                job_base_display_file_with_fullscreen_page.prototype.constructor = job_base_display_file_with_fullscreen_page;
                                job_base_display_file_with_fullscreen_page_obj = new job_base_display_file_with_fullscreen_page();
                                job_base_display_file_with_fullscreen_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }                        
        });

        win.addEventListener('close',function(){
                try{                        
                        //job_base_display_file_with_fullscreen_page_obj.close_window();
                        job_base_display_file_with_fullscreen_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                        
        });
}());