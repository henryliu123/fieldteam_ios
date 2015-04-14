/**
 *  Description: create audio file, user can record audio
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var job_base_create_audio_page_obj = null;

        function job_base_create_audio_page(){
                var self = this;
                var window_source = 'job_base_create_audio_page';
                win.title = 'Audio Recorder';

                //public method
                self.init = function(){
                        try{                       
                                self.init_auto_release_pool(win);
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Done','Main,Back');     
                                //add audioSessionMode to fix crash problem. 
                                Titanium.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAY_AND_RECORD;
                                self.recording = Ti.Media.createAudioRecorder();
                                // default compression is Ti.Media.AUDIO_FORMAT_LINEAR_PCM
                                // default format is Ti.Media.AUDIO_FILEFORMAT_CAF

                                // this will give us a wave file with µLaw compression which
                                // is a generally small size and suitable for telephony recording
                                // for high end quality, you'll want LINEAR PCM - however, that
                                // will result in uncompressed audio and will be very large in size
                                self.recording.compression = Ti.Media.AUDIO_FORMAT_ULAW;
                                self.recording.format = Ti.Media.AUDIO_FILEFORMAT_WAVE;
                                _init_controls();                                
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
                                if(_duration === 0){
                                        self.show_message('You haven\'t start audio. ');
                                        return;
                                }
                                _save_audio(e);  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }                       
                };   
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                   
                self.nav_left_btn_click_event = function(e){
                        try{
                                if(_duration > 0){
                                        _event_for_back_btn(e);
                                }else{
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                self.close_all_window_and_return_to_menu(); 
                                        }else{                                                                
                                                win.close();
                                        }
                                }     
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_left_btn_click_event');
                                return;
                        }
                };                    

                //private member
                var _company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _login_user_name = Ti.App.Properties.getString('current_login_user_name');
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _asset_type_path = win.asset_type_path;
                var _asset_type_code = win.asset_type_code;
                var _file;
                var _timer;
                var _sound;
                var _duration = 0;

                //private method
                /**
                 *  init controls
                 */
                function _init_controls(){
                        try{
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

                                self.start_btn = Titanium.UI.createButton({
                                        backgroundColor:'blue',
                                        borderRadius:3,
                                        color:'#fff',
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        },
                                        title:'Start Recording',
                                        width:200,
                                        height:40,                                        
                                        top:parseInt(self.screen_height/3,10)-40
                                });
                                win.add(self.start_btn);

                                self.pause_btn = Titanium.UI.createButton({
                                        backgroundColor:'blue',
                                        borderRadius:3,
                                        color:'#fff',
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        },
                                        title:'Pause Recording',
                                        width:200,
                                        height:40,
                                        top:parseInt(self.screen_height/3,10)-40
                                });
                                win.add(self.pause_btn);
                                self.pause_btn.visible = false;

                                self.done_btn = Titanium.UI.createButton({
                                        backgroundColor:'blue',
                                        borderRadius:3,
                                        color:'#fff',
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        },
                                        title:'Finish Recording',
                                        width:200,
                                        height:40,
                                        top:parseInt(self.screen_height/3,10)+40
                                });
                                win.add(self.done_btn);
                                self.done_btn.visible = false;

                                self.start_btn.addEventListener('click',function(){
                                        _event_for_start_btn();
                                });

                                self.pause_btn.addEventListener('click',function(){
                                        _event_for_pause_btn();
                                });

                                self.done_btn.addEventListener('click', function(){
                                        _event_for_done_btn();
                                });                               
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_controls');
                                return;
                        }
                }
                /**                
                 *  check timer. if hit max time and then stop it.
                 */
                function _recording_timer(){
                        try{
                                _duration++;
                                self.label.text = 'Duration: '+_duration+' seconds ';
                                if(_duration > self.maximum_audio_length){//5 mins
                                        self.recording.pause();
                                        clearInterval(_timer);                                         
                                        self.show_message(L('message_reach_max_length_audio'));
                                        self.start_btn.visible = false;
                                        self.pause_btn.visible = false;
                                        self.done_btn.visible = true;
                                        return;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _recording_timer');
                                return;
                        }
                }
                /**
                 *  event for start button
                 */
                function _event_for_start_btn(){
                        try{
                                if((Titanium.Platform.model == 'Simulator')||(!Ti.Media.canRecord)){
                                        self.show_message(L('message_audio_no_available_on_device'));
                                        return;
                                }                   
                                self.start_btn.visible = false;
                                self.pause_btn.visible = true;
                                self.done_btn.visible = true;
                                Ti.Media.startMicrophoneMonitor();
                                self.recording.start();
                                self.label.text = 'Duration: '+_duration+' seconds ';
                                _timer = setInterval(_recording_timer,1000);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_start_btn');
                                return;
                        }                                
                }
                /**
                 *  event for pause button
                 */
                function _event_for_pause_btn(){
                        try{
                                if(self.recording.recording){
                                        if(self.recording.paused){
                                                self.pause_btn.title = 'Pause recording';
                                                self.recording.resume();
                                                _timer = setInterval(_recording_timer,1000);
                                        }else{
                                                self.pause_btn.title = "Continue Recording";
                                                self.recording.pause();
                                                clearInterval(_timer);
                                        }
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_pause_btn');
                                return;
                        }                                
                }
                /**
                 *  event for done button
                 */
                function _event_for_done_btn(){
                        try{
                                if(_duration === 0){
                                        self.show_message(L('message_havent_start_audio_in_job_create_audio'));
                                        return;
                                }
                                _save_audio();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_done_btn');
                                return;
                        }
                }
                /**
                 * event for back button
                 */
                function _event_for_back_btn(e){
                        try{
                                var option_dialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['YES','NO','Cancel','']:['YES','NO','Cancel'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:2,
                                        title:L('message_save_audio_in_job_create_audio')
                                });
                                option_dialog.show();
                                option_dialog.addEventListener('click',function(evt){
                                        switch(evt.index){
                                                case 0://yes
                                                        self.nav_right_btn_click_event(e);
                                                        break;
                                                case 1://no
                                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                                self.close_all_window_and_return_to_menu(); 
                                                        }else{                                                                
                                                                win.close();
                                                        }
                                                        break;
                                                case 2://cancel
                                                        self.nav_left_btn.index = -1;
                                                        break;                                                             
                                        }
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_back_btn');
                                return;
                        }
                }
                /**
                 *  save audio
                 */
                function _save_audio(e){
                        try{
                                _file = self.recording.stop();
                                clearInterval(_timer);
                                Ti.Media.stopMicrophoneMonitor();
                                if((_file === '')&&(_file === null)){
                                        self.show_message(L('message_failure_create_file'));
                                        return;
                                }
                                _sound = Titanium.Media.createSound({
                                        sound:_file
                                });
                                if(_sound != null){
                                        var file_extension = 'wav';
                                        var file_id = new Date().getTime();
                                        var create_date_string = self.get_date_string_by_milliseconds(file_id);
                                        file_id = _selected_job_reference_number+'_'+file_id;
                                        if(!self.create_directory(_company_id+'/'+_type+'/'+_selected_job_reference_number+'/'+_asset_type_path)){
                                                self.show_message(L('message_failure_create_folder'));
                                                return;
                                        }
                                        var newFile = Ti.Filesystem.getFile(self.file_directory+_company_id+'/'+_type+'/'+_selected_job_reference_number+'/'+_asset_type_path,file_id + "."+file_extension);
                                        var file_size = 0;
                                        if(newFile.write(_file)){
                                                file_size = newFile.size;
                                        }
                                        
                                        //check upload max size limit 
                                        var temp_upload_is_over_limit = false;
                                        if(file_size > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_audio'),10)){
                                                temp_upload_is_over_limit = true;
                                        } 
                                      
                                        
                                        var d = new Date();
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var new_time_value = parseInt(d.getTime(), 10);
                                        db.execute('INSERT INTO my_'+_type+'_asset (id,local_id,'+_type+'_id,'+_type+'_asset_type_code,name,description,'+
                                                'path_original,path,mime_type,width,height,file_size,status_code,is_local_record,changed)'+
                                                'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                                new_time_value,
                                                _company_id+'-'+_selected_user_id+'-'+new_time_value,
                                                _selected_job_id,
                                                _asset_type_code,
                                                'New Audio',
                                                'Created by '+_login_user_name+' on '+create_date_string,
                                                (_selected_job_id > 1000000000)?_company_id+'/'+_type+'/$d/'+_asset_type_path+'/'+file_id+"."+file_extension:_company_id+'/'+_type+'/'+_selected_job_reference_number+'/'+_asset_type_path+'/'+file_id+"."+file_extension,
                                                (_selected_job_id > 1000000000)?_company_id+'/'+_type+'/$d/'+_asset_type_path+'/'+file_id+"."+file_extension:_company_id+'/'+_type+'/'+_selected_job_reference_number+'/'+_asset_type_path+'/'+file_id+"."+file_extension,
                                                'audio/wav',
                                                0,0,
                                                file_size,
                                                1,1,
                                                1);
                                        db.close();            
                                }
                                if(e == undefined){
                                        win.close();
                                }else{
                                        if(temp_upload_is_over_limit){
                                                var maxImageSize = parseInt(parseInt(Titanium.App.Properties.getString('app_media_upload_limit_audio'),10)/(1000*1000),10);
                                                var alertDialog = Titanium.UI.createAlertDialog({
                                                        title:L('message_warning'),
                                                        message:'This audio is over size. Max uploading size is '+maxImageSize+'M',
                                                        buttonNames:['Close']
                                                });
                                                alertDialog.show();                                                         
                                        }
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                self.close_all_window_and_return_to_menu(); 
                                        }else{                                                                
                                                win.close();
                                        }                                        
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _save_audio');
                                return;
                        }                                
                }
        }

        win.addEventListener('open',function(){
                try{
                        if(job_base_create_audio_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_create_audio_page.prototype = new F();
                                job_base_create_audio_page.prototype.constructor = job_base_create_audio_page;
                                job_base_create_audio_page_obj = new job_base_create_audio_page();
                                job_base_create_audio_page_obj.init();
                        }     
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_base_create_audio_page_obj.close_window();
                        job_base_create_audio_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());



