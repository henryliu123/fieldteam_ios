(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var manager_user_email_signature_page_obj = null;

        function manager_user_email_signature_page(){
                var self = this;
                var window_source = 'manager_user_email_signature_page';
                win.title = 'Email Signature';
                     

                //public method
                /**
                 *  override init function of parent class: transaction.js
                 */                  
                self.init = function(){
                        try{     
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Done','Main,Back');       
                                //call init_table_view function of parent class: fieldteam.js
                                if(!self.is_ios_7_plus()){
                                        _init_textarea_field();
                                        self.init_table_view();
                                }else{
                                        _init_textarea_field_for_ios7();
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }                 
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: transaction.js
                 */                   
                self.nav_right_btn_click_event = function(e){
                        try{
                                if(Ti.Network.online){ 
                                        _save();                                                                                                        
                                }else{                                                                
                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                }                                                                                           
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }                        
                };
                /**
                 *  override nav_left_btn_click_event function of parent class: transaction.js
                 */                     
                self.nav_left_btn_click_event = function(e){
                        try{                                
                                if(_check_if_exist_change()){
                                        var option_dialog = Ti.UI.createOptionDialog({
                                                options:(self.is_ipad())?['YES','NO','Cancel','']:['YES','NO','Cancel'],
                                                buttonNames:['Cancel'],
                                                destructive:0,
                                                cancel:2,
                                                title:L('message_save_changes')
                                        });
                                        option_dialog.show();
                                        option_dialog.addEventListener('click',function(evt){
                                                switch(evt.index){
                                                        case 0:
                                                                self.nav_right_btn_click_event(e);
                                                                break;
                                                        case 1:
                                                                if(e.index == self.default_main_menu_button_index){//menu menu
                                                                        self.close_all_window_and_return_to_menu(); 
                                                                }else{                                                                
                                                                        self.close_window(win);
                                                                }
                                                                break;
                                                        case 2://cancel
                                                                self.nav_left_btn.index = -1;
                                                                break;                                                                     
                                                }
                                        });                                          
                                }else{
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                self.close_all_window_and_return_to_menu(); 
                                        }else{                                                                
                                                self.close_window(win);
                                        }
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_left_btn_click_event');
                                return;
                        }                          
                };                             

                //private member
                var _signature = ((win.content === undefined) || (win.content === null))?'':win.content;
                var _manager_user_email_signature_id = ((win.manager_user_email_signature_id === undefined) || (win.manager_user_email_signature_id === null))?0:win.manager_user_email_signature_id;
                var _local_id = ((win.local_id === undefined) || (win.local_id === null))?null:win.local_id;
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');

                /**
                 *  init job description textarea field
                 */
                function _init_textarea_field(){
                        try{
                                var description_field = Ti.UI.createTableViewRow({
                                        className:'set_textarea_field',
                                        filter_class:'set_textarea_field',
                                        height:'auto'
                                });                                
                                var textarea_content_field = Ti.UI.createTextArea({
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:150,
                                        textAlign:'left',
                                        top:5,
                                        bottom:5,
                                        left:10,
                                        right:10,
                                        value:_signature,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },                                        
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                description_field.add(textarea_content_field);
                                self.data.push(description_field);
                                textarea_content_field.addEventListener('change',function(e){                                        
                                        _signature = e.value;
                                });                                                               
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_textarea_field');
                                return;
                        }
                }          
                function _init_textarea_field_for_ios7(){
                        try{                           
                                var textarea_content_field = Ti.UI.createTextArea({
                                        borderWidth: 1, borderColor: '#ccc', borderRadius: 5,
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:150,
                                        textAlign:'left',
                                        top:5,
                                        bottom:5,
                                        left:10,
                                        right:10,
                                        value:_signature,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },                                        
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                win.add(textarea_content_field);
                                textarea_content_field.addEventListener('change',function(e){                                        
                                        _signature = e.value;
                                });                                                               
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_textarea_field_for_ios7');
                                return;
                        }
                }                        
                
                function _save(){
                        try{                                
                                if(self.trim(_signature).length <=0){
                                        self.show_message('Please enter email signature.');
                                        return;
                                }  
                                self.display_indicator('Saving Data...',true);
                                var d = new Date();
                                var new_time_value = parseInt(d.getTime(), 10);         
                                if(_manager_user_email_signature_id > 0){
                                        _local_id = new_time_value;
                                }
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
                                                        if(self.return_to_login_page_if_user_security_session_changed(this.responseText)){
                                                                return;
                                                        }                                                          
                                                        if(self.display_app_version_incompatiable(this.responseText)){
                                                                return;
                                                        }                                                                                                                
                                                        var temp_result = JSON.parse(this.responseText);
                                                        if((temp_result.error != undefined)&&(temp_result.error.length >0)){
                                                                self.hide_indicator();
                                                                var error_string = '';
                                                                for(var i=0,j=temp_result.error.length;i<j;i++){
                                                                        if(i==j){
                                                                                error_string+=temp_result.error[i];
                                                                        }else{
                                                                                error_string+=temp_result.error[i]+'\n';
                                                                        }
                                                                }
                                                                self.show_message(error_string);
                                                                return;
                                                        }else{
                                                                self.update_selected_tables(null,'ManagerUserEmailSignature',JSON.parse(this.responseText));
                                                                self.hide_indicator();                                                    
                                                                win.close();                                                                                                                         
                                                        }
                                                }else{
                                                        self.hide_indicator();
                                                        var params = {
                                                                message:'Save email signature failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:'',
                                                                error_source:window_source+' - _save - xhr.onload - 1',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                           
                                                        return;
                                                }
                                        }catch(e){
                                                self.hide_indicator();
                                                params = {
                                                        message:'Save email signature failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - _save - xhr.onload - 2',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params); 
                                                return;
                                        }
                                };
                                xhr.onerror = function(e){
                                        self.hide_indicator();
                                        var params = {
                                                message:'Save email signature failed.',
                                                show_message:true,
                                                message_title:'',
                                                send_error_email:true,
                                                error_message:e,
                                                error_source:window_source+' - _save - xhr.onerror',
                                                server_response_message:this.responseText
                                        };
                                        self.processXYZ(params); 
                                        return;
                                };
                                xhr.onsendstream = function(e){
                                        self.update_progress(e.progress,true);
                                };
                                xhr.setTimeout(self.default_time_out);
                                xhr.open('POST',self.get_host_url()+'update',false);
                                xhr.send({
                                        'type':'save_manager_user_email_signature',
                                        'hash':_selected_user_id,
                                        'id':_manager_user_email_signature_id,
                                        'local_id':_local_id,
                                        'manager_user_id':_selected_user_id,
                                        'title':null,
                                        'signature':_signature,
                                        'status_code':1,
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _save');
                                return;
                        }
                }
                
                /**
                 *  check if exist any change
                 */
                function _check_if_exist_change(){
                        try{
                                var is_make_changed = false;
                                if(_signature != win.content){
                                        is_make_changed = true;
                                }
                                return is_make_changed;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_exist_change');
                                return false; 
                        }   
                }                 

        }

        win.addEventListener('focus',function(e){
                try{                        
                        if(manager_user_email_signature_page_obj === null){
                                Ti.App.Properties.setBool('select_client_flag',false);
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                manager_user_email_signature_page.prototype = new F();
                                manager_user_email_signature_page.prototype.constructor = manager_user_email_signature_page;
                                manager_user_email_signature_page_obj = new manager_user_email_signature_page();
                                manager_user_email_signature_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        manager_user_email_signature_page_obj.close_window();
                        manager_user_email_signature_page_obj = null;                        
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());

