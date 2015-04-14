/**
 *  Description: browse file
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_base_display_file_page_obj = null;

        function job_base_display_file_page(){
                var self = this;
                var window_source = 'job_base_display_file_page';
                win.title = win.asset_type_name;

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                 
                self.init = function(){
                        try{          
                                self.init_auto_release_pool(win);
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Edit','Main,Back');    
                                _display();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }                        
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                      
                self.nav_right_btn_click_event = function(e){
                        try{                             
                                var new_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'job/base/job_asset_content.js'),
                                        type:_type,
                                        asset_id:_asset_id,
                                        asset_type_name:win.asset_type_name,
                                        parent_win:win
                                });
                                Titanium.UI.currentTab.open(new_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        } 
                };                    

                //private member
                var _type = win.type;
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _action_for_job = win.action_for_job;
                var _selected_job_reference_number = win.job_reference_number;
                var _asset_id = win.asset_id;
                var _asset_type_path = win.asset_type_path;
                var _asset_mime_type = win.asset_mime_type;
                var _file_name_array = win.file_name.split('/');
                var _file_name = _file_name_array[_file_name_array.length-1];
                var _asset_mime_type_array = _asset_mime_type.split('/');
                var _asset_mime_type_name = (_asset_mime_type_array.length>0)?_asset_mime_type_array[0]:'';
                var _file_folder = self.file_directory+_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/'+_asset_type_path;
                var _file_folder_url = self.get_media_url()+'/'+_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/'+_asset_type_path+'/';

                //private method
                /**
                 *  display file . if file not exist then download it.
                 */
                function _display(){
                        try{
                                var file_obj = Titanium.Filesystem.getFile(_file_folder,_file_name);
                                if(!file_obj.exists()){
                                        var option_dialog = Ti.UI.createOptionDialog({
                                                options:(self.is_ipad())?['YES','NO','']:['YES','NO'],
                                                buttonNames:['No'],
                                                destructive:0,
                                                cancel:1,
                                                title:L('message_not_exist_in_job_display_file')
                                        });
                                        option_dialog.show();
                                        option_dialog.addEventListener('click',function(e){
                                                if(e.index === 0){
                                                        if(!Ti.Network.online){
                                                                self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                                return;
                                                        }else{
                                                                //_is_ever_download_file = true;
                                                                self.display_indicator('Downloading File...',true);
                                                                var xhr = null;
                                                                if(self.set_enable_keep_alive){
                                                                        xhr = Ti.Network.createHTTPClient({
                                                                                enableKeepAlive:false
                                                                        });
                                                                }else{
                                                                        xhr = Ti.Network.createHTTPClient();
                                                                }
                                                                xhr.onload = function(){
                                                                        try{
                                                                                if((xhr.readyState === 4)&&(this.status === 200)){                                                                                     
                                                                                        if(!self.create_directory(_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/'+_asset_type_path)){
                                                                                                self.hide_indicator();
                                                                                                self.show_message(L('message_failure_create_folder'));               
                                                                                                return;
                                                                                        }
                                                                                        var media_obj = Ti.Filesystem.getFile(_file_folder,_file_name);
                                                                                        media_obj.write(this.responseData);
                                                                                        if(_asset_mime_type_name === 'image'){
                                                                                                _get_resized_image(_file_name,'thumb');//create thumb image
                                                                                        }
                                                                                        switch(_asset_mime_type_name){
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
                                                                                        self.hide_indicator();
                                                                                }else{
                                                                                        self.hide_indicator();
                                                                                        var params = {
                                                                                                message:L('message_failure_download_file'),
                                                                                                show_message:true,
                                                                                                message_title:'',
                                                                                                send_error_email:true,
                                                                                                error_message:'',
                                                                                                error_source:window_source+' - _display - xhr.onload -1',
                                                                                                server_response_message:this.responseText
                                                                                        };
                                                                                        self.processXYZ(params);                                                                                        
                                                                                        return;
                                                                                }
                                                                        }catch(e){
                                                                                self.hide_indicator();
                                                                                params = {
                                                                                        message:L('message_failure_download_file'),
                                                                                        show_message:true,
                                                                                        message_title:'',
                                                                                        send_error_email:true,
                                                                                        error_message:e,
                                                                                        error_source:window_source+' - _display - xhr.onload -2',
                                                                                        server_response_message:this.responseText
                                                                                };
                                                                                self.processXYZ(params);                                                                                
                                                                        }
                                                                };
                                                                xhr.ondatastream = function(e){
                                                                        self.update_progress(e.progress,true);
                                                                };
                                                                xhr.onerror = function(e){
                                                                        self.hide_indicator();
                                                                        var params = {
                                                                                message:L('message_failure_download_file'),
                                                                                show_message:true,
                                                                                message_title:'',
                                                                                send_error_email:true,
                                                                                error_message:e,
                                                                                error_source:window_source+' - _display - xhr.onerror',
                                                                                server_response_message:this.responseText
                                                                        };
                                                                        self.processXYZ(params);                                                                         
                                                                };
                                                                xhr.setTimeout(self.default_download_time_out);
                                                                xhr.open('GET',_file_folder_url+_file_name);
                                                                xhr.send();
                                                        }
                                                }
                                        });
                                }else{
                                        switch(_asset_mime_type_name){
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
                                }
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
                                var asset_obj = Ti.Filesystem.getFile(_file_folder,_file_name);
                                if(asset_obj.exists()){
                                        var baseHeight = asset_obj.toBlob().height;
                                        var baseWidth = asset_obj.toBlob().width;
                                        var asset_view = Ti.UI.createImageView({
                                                backgroundColor:'#000',
                                                height:self.screen_width*baseHeight/baseWidth,
                                                width:self.screen_width,
                                                image:_file_folder+'/'+_file_name
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
                                                baseHeight = asset_view.height;
                                                baseWidth = asset_view.width;
                                        });                                        
                                }else{
                                        var asset_label = Ti.UI.createLabel({
                                                width:self.screen_width,
                                                textAlign:'center',
                                                text:'The system can\'t find file.'
                                        });
                                        win.add(asset_label);
                                }
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
                                        url:_file_folder+'/'+_file_name
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
                                var audio_obj = Titanium.Filesystem.getFile(_file_folder,_file_name);
                                if(!audio_obj.exists()){
                                        self.show_message(L('message_failure_open_file'));
                                        return;
                                }

                                self.audio = Titanium.Media.createSound({
                                        url:audio_obj.nativePath,
                                        allowBackground:false
                                });  

                                self.is_pause = false;
                                self.label = Titanium.UI.createLabel({
                                        text:'',
                                        top:parseInt(self.screen_height/3,10)-80,
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
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        },
                                        color:self.font_color,
                                        title:'Play',
                                        width:200,
                                        height:40,
                                        left:(self.screen_width-200)/2,
                                        top:parseInt(self.screen_height/3,10)-40
                                });
                                win.add(self.play_btn);
                                self.pause_btn = Titanium.UI.createButton({
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        },
                                        color:self.font_color,
                                        title:'Pause',
                                        width:200,
                                        height:40,
                                        left:(self.screen_width-200)/2,
                                        top:parseInt(self.screen_height/3,10)-40
                                });
                                win.add(self.pause_btn);
                                self.pause_btn.visible = false;
                                self.stop_btn = Titanium.UI.createButton({
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        },
                                        color:self.font_color,
                                        title:'Stop',
                                        width:200,
                                        height:40,
                                        left:(self.screen_width-200)/2,
                                        top:parseInt(self.screen_height/3,10)+40
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
                                var activeMovie = Titanium.Media.createVideoPlayer({
                                        url:_file_folder+'/'+_file_name,
                                        movieControlMode: Titanium.Media.VIDEO_CONTROL_DEFAULT,
                                        scalingMode:Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
                                        autoplay:true
                                }); 
                                win.add(activeMovie);                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _play_video');
                                return;
                        }                                
                }
                /*
                 * create a resized image, fit the device size
                 * image_type is thumb or resized , resized image only for cover flow
                 */
                function _get_resized_image(origin_file_name,image_type) {
                        try{
                                var origin_image = Ti.Filesystem.getFile(_file_folder,origin_file_name);
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
                                var resized_image = Ti.Filesystem.getFile(_file_folder,image_type+'_'+origin_file_name);
                                resized_image.write(blob);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_resized_image');
                                return;
                        }                                
                }
        }

        win.addEventListener('open',function(){
                try{
                        if(job_base_display_file_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_display_file_page.prototype = new F();
                                job_base_display_file_page.prototype.constructor = job_base_display_file_page;
                                job_base_display_file_page_obj = new job_base_display_file_page();
                                job_base_display_file_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }                        
        });

        win.addEventListener('close',function(){
                try{
                        clearInterval(job_base_display_file_page_obj.audio_interval);  
                        job_base_display_file_page_obj.close_window();
                        job_base_display_file_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                        
        });
}());