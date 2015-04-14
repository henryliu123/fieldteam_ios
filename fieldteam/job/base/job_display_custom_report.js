/**
 *  Description: browse file
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_base_display_custom_report_page_obj = null;

        function job_base_display_custom_report_page(){
                var self = this;
                var window_source = 'job_base_display_custom_report_page';
                win.title = 'Display Report';

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                 
                self.init = function(){
                        try{          
                                self.init_auto_release_pool(win);
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Options','Main,Back');  
                                self.asset_view = null;
                                _display();
                                Ti.App.addEventListener('refresh_custom_report_file', function(){
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
                                var signatureCount = 0;
                                var is_merge_signature = 0;
                                var db = Titanium.Database.open(self.get_db_name());
                                var sql = '';
                                sql = 'select * from my_'+_type+'_custom_report_signature where '+_type+'_custom_report_data_id=? and status_code=1';
                                var rows = db.execute(sql,_job_custom_report_data_id);
                                signatureCount = rows.getRowCount();
                                _signature_id = rows.fieldByName('id');
                                rows.close();
                                
                                //check is_merge_signature field
                                rows = db.execute('select * from my_'+_type+'_custom_report_data where id=?',_job_custom_report_data_id);
                                if(rows.isValidRow()){
                                        is_merge_signature = rows.fieldByName('is_merge_signature');
                                        if(is_merge_signature == null){
                                                is_merge_signature = 0;
                                        }
                                }
                                rows.close();
                                db.close();
                                var signature_text = 'Add Signature';
                                if((signatureCount > 0) || (is_merge_signature)){
                                        var option_dialog = null;
                                        option_dialog = Ti.UI.createOptionDialog({
                                                options:(self.is_ipad())?['Email To','Reload Report','Cancel','']:['Email To','Reload Report','Cancel'],
                                                buttonNames:['Cancel'],
                                                destructive:0,
                                                cancel:2,
                                                title:'Please select an option.'
                                        });
                                        option_dialog.show();
                                        option_dialog.addEventListener('click',function(evt){
                                                switch(evt.index){
                                                        case 0://send email                                                                
                                                                if(Ti.Network.online){ 
                                                                        _send_email_for_custom_report();                                                                                                       
                                                                }else{                                                                
                                                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                                }                                                                  
                                                                break;
                                                        case 1://reload invoice
                                                                if(Ti.Network.online){ 
                                                                        _download_report_file();                                                                                                       
                                                                }else{                                                                
                                                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                                }  
                                                                break;
                                                        case 2://cancel
                                                                break;                                                                 
                                                }
                                        });
                                }else{
                                        option_dialog = null;
                                        option_dialog = Ti.UI.createOptionDialog({
                                                options:(self.is_ipad())?['Email To',signature_text,'Reload Report','Cancel','']:['Email To',signature_text,'Reload Report','Cancel'],
                                                buttonNames:['Cancel'],
                                                destructive:0,
                                                cancel:3,
                                                title:'Please select an option.'
                                        });
                                        option_dialog.show();
                                        option_dialog.addEventListener('click',function(evt){
                                                switch(evt.index){
                                                        case 0://send email
                                                                if(Ti.Network.online){ 
                                                                        _send_email_for_custom_report();                                                                                                       
                                                                }else{                                                                
                                                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                                } 
                                                                break;
                                                        case 1://add signature or display signature
                                                                var new_win = Ti.UI.createWindow({
                                                                        url:self.get_file_path('url','job/base/job_custom_report_signature.js'),
                                                                        type:_type,
                                                                        job_id:_selected_job_id,
                                                                        job_reference_number:_selected_job_reference_number,
                                                                        job_custom_report_data_id:_job_custom_report_data_id,
                                                                        job_custom_report_signature_id:_signature_id,
                                                                        action_for_signature:(_signature_id>0)?'edit_job_custom_report_signature':'add_job_custom_report_signature'
                                                                });
                                                                Ti.UI.currentTab.open(new_win,{
                                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                                });     
                                                                break;
                                                        case 2://reload invoice
                                                                if(Ti.Network.online){ 
                                                                        _download_report_file();                                                                                                       
                                                                }else{                                                                
                                                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                                }                                                                                                                                
                                                                break;
                                                        case 3://cancel
                                                                break;                                                                 
                                                }
                                        });                                        
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
                var _job_custom_report_data_id = win.job_custom_report_data_id;
                var _signature_id = 0;
                var _file_name_array = win.path.split('/');
                var _file_name = _file_name_array[_file_name_array.length-1];
                var _file_folder = self.file_directory+_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/report';

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
                                                                _download_report_file();                                                                      
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
                /**
                 *  send email while attach report as attachment.
                 */
                function _send_email_for_custom_report(){
                        try{
                                var array = [];
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_'+_type+'_custom_report_data WHERE id=?',_job_custom_report_data_id);
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var file_name_array = rows.fieldByName('path').split('/');
                                                var file_name = '';
                                                if(file_name_array.length > 0){
                                                        file_name = file_name_array[file_name_array.length-1];
                                                }
                                                var temp_var = {
                                                        local_id:rows.fieldByName('local_id'),
                                                        system_id:rows.fieldByName('id'),
                                                        name:file_name,
                                                        path:rows.fieldByName('path'),
                                                        directory:'storage',
                                                        type:'report'
                                                };
                                                array.push(temp_var);
                                                rows.next();
                                        }                                        
                                }                                                                                                                            
                                Ti.App.Properties.setString('attachments_string',JSON.stringify(array));
                                rows.close();
                                db.close();
                                var email_win = Titanium.UI.createWindow({
                                        title:'Email',
                                        url:self.get_file_path('url','action/email2.js'),
                                        type:_type,
                                        from_source:'report',
                                        source:'email',
                                        recipients:JSON.stringify([]),
                                        contact_type_code:3,
                                        job_id:_selected_job_id,
                                        job_reference_number:_selected_job_reference_number
                                });
                                Ti.UI.currentTab.open(email_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _send_email_for_custom_report');
                                return;
                        }                                    
                }
                /*
                 * download invoice pdf
                 */
                function _download_report_file(){
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
                                                        if(!self.create_directory(_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/report')){
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
                                                                error_source:window_source+' - _download_report_file - xhr.onload -1',
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
                                                        error_source:window_source+' - _download_report_file - xhr.onload - 2',
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
                                                error_source:window_source+' - _download_report_file - xhr.onerror',
                                                server_response_message:this.responseText
                                        };
                                        self.processXYZ(params); 
                                };
                                xhr.setTimeout(self.default_download_time_out);   
                                xhr.open('POST',self.get_host_url()+'update',false);
                                xhr.send({
                                        'type':'download_custom_report',   
                                        'job_type':_type,
                                        'hash':_selected_user_id,
                                        'user_id':_selected_user_id,
                                        'company_id':_selected_company_id,
                                        'job_reference_number':_selected_job_reference_number,
                                        'job_custom_report_data_id':_job_custom_report_data_id,
                                        'quote_custom_report_data_id':_job_custom_report_data_id,
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _download_report_file');
                                return;
                        }
                }
        }

        win.addEventListener('open',function(){
                try{
                        if(job_base_display_custom_report_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_display_custom_report_page.prototype = new F();
                                job_base_display_custom_report_page.prototype.constructor = job_base_display_custom_report_page;
                                job_base_display_custom_report_page_obj = new job_base_display_custom_report_page();
                                job_base_display_custom_report_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }                        
        });

        win.addEventListener('close',function(){
                try{
                        job_base_display_custom_report_page_obj.close_window();
                        job_base_display_custom_report_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                        
        });
}());