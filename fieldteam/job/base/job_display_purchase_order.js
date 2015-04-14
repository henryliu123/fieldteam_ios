/**
 *  Description: browse file
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_base_display_purchase_order_page_obj = null;

        function job_base_display_purchase_order_page(){
                var self = this;
                var window_source = 'job_base_display_purchase_order_page';
                win.title = 'Purchase Order';

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                 
                self.init = function(){
                        try{          
                                self.init_auto_release_pool(win);
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Reload','Main,Back');  
                                self.asset_view = null;
                                _display();
                                Ti.App.addEventListener('refresh_purchase_order_file', function(){
                                        _play_pdf();
                                });                                
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
                                if(Ti.Network.online){ 
                                        _download_purchase_order_file();                                                                                                                
                                }else{
                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }
                };                                         

                //private member
                var _type = win.type;
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _purchase_order_id = win.purchase_order_id;
                var _file_name_array = win.file_name.split('/');
                var _file_name = _file_name_array[_file_name_array.length-1];
                var _file_folder = self.file_directory+_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/purchase';

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
                                                if(e.index == 0){
                                                        if(!Ti.Network.online){
                                                                self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                                return;
                                                        }else{
                                                                _download_purchase_order_file();                                                                      
                                                        }
                                                }
                                        });
                                }else{
                                        _play_pdf();
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display');
                                return;
                        }                                
                }                                
                /** 
                 *  display pdf
                 */                
                function _play_pdf(){
                        try{
                                if(self.asset_view != null){
                                        win.remove(self.asset_view);
                                        self.asset_view = null;
                                }
                                self.asset_view = Ti.UI.createWebView({
                                        bottom:0,
                                        scalespageToFilt:true,
                                        url:_file_folder+'/'+_file_name
                                });
                                win.add(self.asset_view);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _play_pdf');
                                return;
                        }                                
                }                                
                /*
                 * download purchase_order pdf
                 */
                function _download_purchase_order_file(){
                        try{
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
                                                        if(!self.create_directory(_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/purchase')){
                                                                self.hide_indicator();
                                                                self.show_message(L('message_failure_create_folder'));               
                                                                return;
                                                        }
                                                        var media_obj = Ti.Filesystem.getFile(_file_folder,_file_name);
                                                        media_obj.write(this.responseData);
                                                        _play_pdf();
                                                        self.hide_indicator();                                                                                    
                                                }else{
                                                        self.hide_indicator();
                                                        var params = {
                                                                message:L('message_failure_download_file'),
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:'',
                                                                error_source:window_source+' - _download_purchase_order_file - xhr.onload - 1',
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
                                                        error_source:window_source+' - _download_purchase_order_file - xhr.onload - 2',
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
                                                error_source:window_source+' - _download_purchase_order_file - xhr.onerror',
                                                server_response_message:this.responseText
                                        };
                                        self.processXYZ(params);   
                                };
                                xhr.setTimeout(self.default_download_time_out);   
                                xhr.open('POST',self.get_host_url()+'update',false);
                                xhr.send({
                                        'type':'download_purchase_order',   
                                        'job_type':_type,
                                        'hash':_selected_user_id,
                                        'user_id':_selected_user_id,
                                        'purchase_order_id':_purchase_order_id,
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _download_purchase_order_file');
                                return;
                        }
                }
        }

        win.addEventListener('open',function(){
                try{
                        if(job_base_display_purchase_order_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_display_purchase_order_page.prototype = new F();
                                job_base_display_purchase_order_page.prototype.constructor = job_base_display_purchase_order_page;
                                job_base_display_purchase_order_page_obj = new job_base_display_purchase_order_page();
                                job_base_display_purchase_order_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }                        
        });

        win.addEventListener('close',function(){
                try{
                        job_base_display_purchase_order_page_obj.close_window();
                        job_base_display_purchase_order_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                        
        });
}());