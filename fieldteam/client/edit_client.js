/**
 *  Description: client editor
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var client_edit_client_page_obj = null;

        function client_edit_client_page(){
                var self = this;
                var window_source = 'client_edit_client_page';
                if(win.action_for_client == 'edit_client'){
                        win.title = 'Edit Client';
                }else{
                        win.title = 'Add Client';
                } 
                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                    
                self.init = function(){
                        try{         
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Save','Main,Back');
                                self.init_vars();
                                _init_client_type_field();
                                _init_client_name_field();
                                _init_client_abbr_field();
                                
                                _init_client_mobile_field();
                                _init_client_phone_field();
                                _init_client_fax_field();
                                _init_client_email_field();
                                _init_client_website_field();
                                _init_client_skype_field();                                
                                
                                _init_client_address_field();
                                _init_client_description_field();
                                _init_client_postal_address_field();
                                if((win.action_for_client == 'edit_client')){
                                        _init_client_contacts_list_btn();
                                //_init_delete_btn();
                                }
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_is_client_name_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_client_abbr_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_client_mobile_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_client_phone_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_client_fax_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }   
                                        if(_is_client_email_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_client_website_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }     
                                        if(_is_client_skype_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }                                     
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return; 
                        }
                };
                /**
                 *  override init_vars function of parent class: fieldteam.js
                 */                  
                self.init_vars = function(){
                        try{
                                if(win.action_for_client == 'add_client'){
                                        var d= new Date();
                                        _selected_client_id = parseInt(d.getTime(),10);
                                }

                                if(win.action_for_client == 'edit_client'){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var clientObj = db.execute('SELECT * FROM my_client WHERE id=?',_selected_client_id);
                                        if((clientObj.getRowCount() > 0) && (clientObj.isValidRow())){
                                                _client_type_code = clientObj.fieldByName('client_type_code');
                                                _client_name = clientObj.fieldByName('client_name');
                                                _client_abbr = clientObj.fieldByName('client_abbr');
                                                _client_mobile = clientObj.fieldByName('phone_mobile');
                                                _client_phone = clientObj.fieldByName('phone');
                                                _client_fax = clientObj.fieldByName('fax');
                                                _client_skype_name = clientObj.fieldByName('skype_name');
                                                _client_email = clientObj.fieldByName('email');
                                                _client_website = clientObj.fieldByName('website');                                                                                               
                                                _client_sub_number = clientObj.fieldByName('sub_number');
                                                _client_unit_number = clientObj.fieldByName('unit_number');
                                                _client_street_number = clientObj.fieldByName('street_number');
                                                _client_street_type = clientObj.fieldByName('street_type');
                                                _client_street_type_id = clientObj.fieldByName('locality_street_type_id');
                                                _client_street = clientObj.fieldByName('street');
                                                _client_street = self.display_correct_street(_client_street,_client_street_type);
                                                _client_suburb = clientObj.fieldByName('suburb');
                                                _client_suburb_id = clientObj.fieldByName('locality_suburb_id');
                                                _client_postcode = clientObj.fieldByName('postcode');
                                                _client_state_id = clientObj.fieldByName('locality_state_id');
                                                _client_description = clientObj.fieldByName('description');
                                                _client_postal_address = clientObj.fieldByName('postal_address');
                                                clientObj.close();
                                                if(_client_state_id > 0){
                                                        var selected_state_obj = db.execute('SELECT * FROM my_locality_state WHERE id=?',_client_state_id);
                                                        if(selected_state_obj.getRowCount() > 0){
                                                                if(selected_state_obj.isValidRow()){
                                                                        _client_state = selected_state_obj.fieldByName('state');
                                                                }
                                                        }
                                                        selected_state_obj.close();
                                                }
                                        }else{
                                                clientObj.close();
                                        }                                        
                                        db.close();
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return; 
                        }                        
                };      
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                  
                self.nav_right_btn_click_event = function(e){
                        try{
                                var is_make_changed = _check_if_make_change();
                                if(!is_make_changed){
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                self.close_all_window_and_return_to_menu(); 
                                        }else{                                                                
                                                win.close();
                                        }
                                        return;
                                }
                                if(!Ti.Network.online){
                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                        return; 
                                }
                                var error_string = '';
                                for(var i=0,j=self.data.length;i<j;i++){
                                        if(self.data[i].valueRequired){
                                                if(self.data[i].valueType === 'text'){
                                                        if(self.data[i].children[self.data[i].valuePosition-1].text === ''){
                                                                error_string += self.data[i].valuePrompt+'\n';
                                                        }
                                                }else{
                                                        if(self.data[i].children[self.data[i].valuePosition-1].value === ''){
                                                                error_string += self.data[i].valuePrompt+'\n';
                                                        }
                                                }
                                        }
                                        if(self.data[i].valueCheckExtra != null){
                                                if(self.data[i].children[self.data[i].valuePosition-1].value != ''){
                                                        if(self.data[i].valueCheckExtra === 'phone_number'){
                                                                if(!self.check_valid_phone_number(self.data[i].children[self.data[i].valuePosition-1].value)){
                                                                        error_string += self.data[i].valueCheckPrompt+'\n';
                                                                }
                                                        }
                                                        if(self.data[i].valueCheckExtra === 'email'){
                                                                if(!self.check_valid_email(self.data[i].children[self.data[i].valuePosition-1].value)){
                                                                        error_string += self.data[i].valueCheckPrompt+'\n';
                                                                }
                                                        }
                                                }
                                        }                                        
                                }

                                var temp_evt = e;
                                if(error_string != ''){
                                        self.show_message(error_string);
                                        return; 
                                }
                                self.display_indicator('Saving Data...',true);
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
                                                                error_string = '';
                                                                for(i=0,j=temp_result.error.length;i<j;i++){
                                                                        if(i==j){
                                                                                error_string+=temp_result.error[i];
                                                                        }else{
                                                                                error_string+=temp_result.error[i]+'\n';
                                                                        }
                                                                }
                                                                self.show_message(error_string);
                                                                return; 
                                                        }else{
                                                                self.update_selected_tables(null,'Client',JSON.parse(this.responseText));  
                                                                self.update_selected_tables(null,'Summary',JSON.parse(this.responseText));  
                                                                //_clean_database_and_file(_selected_client_id);
                                                                self.hide_indicator();
                                                                if(temp_evt.index == self.default_main_menu_button_index){//menu menu
                                                                        self.close_all_window_and_return_to_menu(); 
                                                                }else{                                                                
                                                                        self.close_window(win);
                                                                        if((_parent_win != undefined) && (win.is_close_parent_win != undefined) && (win.is_close_parent_win)){
                                                                                //self.close_window(_parent_win);
                                                                                _parent_win.close();
                                                                        }                                                                        
                                                                }
                                                        }
                                                }else{
                                                        self.hide_indicator();
                                                        var params = {
                                                                message:'Save client failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:'',
                                                                error_source:window_source+' - self.nav_right_btn_click_event - xhr.onload - 1',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);
                                                        return; 
                                                }
                                        }catch(e){
                                                self.hide_indicator();
                                                params = {
                                                        message:'Save client failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - self.nav_right_btn_click_event - xhr.onload - 1',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);                                                
                                                return; 
                                        }                                        
                                        
                                };
                                xhr.onerror = function(e){
                                        self.hide_indicator();
                                        var params = {
                                                message:'Save client failed.',
                                                show_message:true,
                                                message_title:'',
                                                send_error_email:true,
                                                error_message:e,
                                                error_source:window_source+' - self.nav_right_btn_click_event - xhr.onerror',
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
                                        'type':'save_client',
                                        'hash':_selected_user_id,
                                        'id':_selected_client_id,
                                        'reference_number':_selected_client_reference_number,
                                        'user_id':_selected_user_id,
                                        'company_id':_selected_company_id,
                                        'client_type_code':_client_type_code,
                                        'client_name':self.trim(_client_name),
                                        'client_abbr':self.trim(_client_abbr),
                                        'phone_mobile':self.trim(_client_mobile),
                                        'phone':self.trim(_client_phone),
                                        'fax':self.trim(_client_fax),
                                        'skype_name':self.trim(_client_skype_name),
                                        'email':self.trim(_client_email),
                                        'website':self.trim(_client_website),
                                        'description':self.trim(_client_description),
                                        'sub_number':(_client_sub_number != '')?self.trim(_client_sub_number.toLowerCase()):'',
                                        'unit_number':(_client_unit_number != '')?self.trim(_client_unit_number.toLowerCase()):'',
                                        'street_number':(_client_street_number != '')?self.trim(_client_street_number.toLowerCase()):'',
                                        'street':(_client_street!='')?self.trim(_client_street.toUpperCase()):'',
                                        'suburb':((_client_suburb != '')||(_client_suburb != null))?self.trim(_client_suburb.toUpperCase()):'',
                                        'postcode':((_client_postcode != '')||(_client_postcode != null))?self.trim(_client_postcode.toUpperCase()):'',
                                        'locality_state_id':_client_state_id,
                                        'locality_street_type_id':_client_street_type_id,
                                        'locality_suburb_id':_client_suburb_id,
                                        'postal_address':_client_postal_address,
                                        'status_code':1,
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return; 
                        }                           
                };
                /**
                 *  override nav_left_btn_click_event function of parent class: fieldteam.js
                 */    
                self.nav_left_btn_click_event = function(e){
                        try{
                                var is_make_changed = _check_if_make_change();
                                if(!is_make_changed){
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                self.close_all_window_and_return_to_menu(); 
                                        }else{                                                                
                                                win.close();
                                        }
                                        return;
                                }
                                var option_dialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['YES','NO','Cancel','']:['YES','NO','Cancel'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:2,
                                        title:L('message_save_client_in_edit_client_for_select_type')
                                });
                                option_dialog.show();
                                option_dialog.addEventListener('click',function(evt){
                                        switch(evt.index){
                                                case 0://yes
                                                        self.nav_right_btn_click_event(e);
                                                        break;
                                                case 1://no
                                                        if(_selected_client_id > 1000000000){
                                                                _clean_database_and_file(_selected_client_id);
                                                                if(e.index == self.default_main_menu_button_index){//menu menu
                                                                        self.close_all_window_and_return_to_menu(); 
                                                                }else{                                                                
                                                                        win.close();
                                                                }
                                                        }else{
                                                                var temp_evt = e;
                                                                if(Ti.Network.online){
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
                                                                                                if(this.responseText != '[]'){
                                                                                                        self.update_selected_tables(null,'Client',JSON.parse(this.responseText));  
                                                                                                        self.update_selected_tables(null,'Summary',JSON.parse(this.responseText));  
                                                                                                }
                                                                                        }else{
                                                                                                var params = {
                                                                                                        message:'Refresh client failed.',
                                                                                                        show_message:true,
                                                                                                        message_title:'',
                                                                                                        send_error_email:true,
                                                                                                        error_message:'',
                                                                                                        error_source:window_source+' - self.nav_left_btn_click_event -xhr.onload -1',
                                                                                                        server_response_message:this.responseText
                                                                                                };
                                                                                                self.processXYZ(params);                                                                                                
                                                                                                return; 
                                                                                        }
                                                                                }catch(e){
                                                                                        params = {
                                                                                                message:'Refresh client failed.',
                                                                                                show_message:true,
                                                                                                message_title:'',
                                                                                                send_error_email:true,
                                                                                                error_message:e,
                                                                                                error_source:window_source+' - self.nav_left_btn_click_event -xhr.onload -2',
                                                                                                server_response_message:this.responseText
                                                                                        };
                                                                                        self.processXYZ(params);  
                                                                                        return; 
                                                                                }
                                                                        };
                                                                        xhr.onerror = function(e){
                                                                                var params = {
                                                                                        message:'Refresh client failed.',
                                                                                        show_message:true,
                                                                                        message_title:'',
                                                                                        send_error_email:true,
                                                                                        error_message:e,
                                                                                        error_source:window_source+' - self.nav_left_btn_click_event -xhr.onerror',
                                                                                        server_response_message:this.responseText
                                                                                };
                                                                                self.processXYZ(params);                                                                                  
                                                                                return; 
                                                                        };
                                                                        xhr.setTimeout(self.default_time_out);
                                                                        xhr.open('POST',self.get_host_url()+'update',false);
                                                                        xhr.send({
                                                                                'type':'download_client',
                                                                                'hash':_selected_user_id,
                                                                                'user_id':_selected_user_id,
                                                                                'company_id':_selected_company_id,
                                                                                'client_id':_selected_client_id,
                                                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                                                'app_version_increment':self.version_increment,
                                                                                'app_version':self.version,
                                                                                'app_platform':self.get_platform_info()
                                                                        });
                                                                }else{
                                                                        self.show_message(L('message_offline_and_save_local_in_edit_client_for_select_type'));
                                                                        return; 
                                                                }
                                                                if(temp_evt.index == self.default_main_menu_button_index){//menu menu
                                                                        self.close_all_window_and_return_to_menu(); 
                                                                }else{                                                                
                                                                        win.close();
                                                                }
                                                        }
                                                        break;
                                                case 2://cancel
                                                        self.nav_left_btn.index = -1;
                                                        break;                                                             
                                        }
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_left_btn_click_event');
                                return; 
                        }                        
                };
                /**
                 *  override table_view_click_event function of parent class: fieldteam.js
                 */    
                self.table_view_click_event = function(e){
                        try{
                                _current_selected_row = e.row;
                                var index = e.index;
                                var filter_class = self.data[index].filter_class;
                                switch(filter_class){
                                        case 'set_client_type_code':
                                                _display_client_type_edit_page(e);    
                                                break;
                                        case 'set_client_address':
                                                _display_address_edit_page(e);
                                                break;
                                        case 'set_contacts_button':
                                                _display_client_contacts_list(e);
                                                break;
                                        case 'set_delete_button':
                                                _delete_btn_click_event();
                                                break;
                                        case 'set_client_name':
                                        case 'set_client_abbr':
                                                self.check_and_set_object_focus(0,index,1);
                                                break;
                                        case 'set_client_client_description':
                                                _display_description_edit_page(e);
                                                break;
                                        case 'set_client_postal_address':
                                                _display_postal_address_edit_page(e);    
                                                break;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return; 
                        }                          
                };                
                /**
                 *  update field value after set properties 
                 *  in focus event call it
                 */
                self.update_field_value_after_set_properites = function(){
                        try{        
                                if(Ti.App.Properties.getBool('update_unique_code_edit_client_view_flag')){                                      
                                        _client_type_code = Ti.App.Properties.getString('update_unique_code_edit_client_view_id');
                                        if(_current_selected_row != null){
                                                _current_selected_row.client_type_code = _client_type_code;
                                                _current_selected_row.client_type_name = Ti.App.Properties.getString('update_unique_code_edit_client_view_content');
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _current_selected_row.client_type_name;
                                                if((_current_selected_row.client_type_name === '')||(_current_selected_row.client_type_name === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_unique_code_edit_client_view_flag',false);
                                }                                 
                                if(Ti.App.Properties.getBool('edit_address_flag')){
                                        _client_sub_number = self.trim(Ti.App.Properties.getString('edit_address_sub_number'));
                                        _client_unit_number = self.trim(Ti.App.Properties.getString('edit_address_unit_number'));
                                        _client_street_number = self.trim(Ti.App.Properties.getString('edit_address_street_number'));
                                        _client_street = self.trim(Ti.App.Properties.getString('edit_address_street'));
                                        _client_suburb = self.trim(Ti.App.Properties.getString('edit_address_suburb'));
                                        _client_postcode = self.trim(Ti.App.Properties.getString('edit_address_postcode'));
                                        _client_state_id = Ti.App.Properties.getString('edit_address_stateID');
                                        _client_state = Ti.App.Properties.getString('edit_address_state');
                                        _client_street_type_id = Ti.App.Properties.getString('edit_address_street_type_id');
                                        _client_suburb_id = Ti.App.Properties.getString('edit_address_suburb_id');
                                        _current_selected_row.client_sub_number = _client_sub_number;
                                        _current_selected_row.client_unit_number = _client_unit_number;
                                        _current_selected_row.client_street_number = _client_street_number;
                                        _current_selected_row.client_street = _client_street;
                                        _current_selected_row.client_suburb = _client_suburb;
                                        _current_selected_row.client_postcode = _client_postcode;
                                        _current_selected_row.client_state_id = _client_state_id;
                                        _current_selected_row.client_state = _client_state;
                                        var address = (_client_unit_number === null)?'':_client_unit_number;
                                        if(address != ''){
                                                address+= (_client_sub_number === null)?'/':'-'+_client_sub_number+'/';
                                        }
                                        address += _client_street_number+' '+_client_street+'\n'+_client_suburb+(_client_postcode===''?'':' '+_client_postcode);
                                        if(_client_state != ''){
                                                address += '\n'+_client_state;
                                        }
                                        _current_selected_row.children[_current_selected_row.children.length-1].text = address;
                                        if((address === '')||(address === null)){
                                                _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                        }else{
                                                _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                        }                                 
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('edit_address_flag',false);
                                }      
                                if(Ti.App.Properties.getBool('update_edit_textarea_field_edit_client_description_view_flag')){                                         
                                        _client_description = Ti.App.Properties.getString('update_edit_textarea_field_edit_client_description_view_content');
                                        if(_current_selected_row != null){
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _client_description;
                                                if((_client_description === '')||(_client_description === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_edit_textarea_field_edit_client_description_view_flag',false);
                                }
                                if(Ti.App.Properties.getBool('update_edit_textarea_field_edit_client_postal_address_view_flag')){                                         
                                        _client_postal_address = Ti.App.Properties.getString('update_edit_textarea_field_edit_client_postal_address_view_content');
                                        if(_current_selected_row != null){
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _client_postal_address;
                                                if((_client_postal_address === '')||(_client_postal_address === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_edit_textarea_field_edit_client_postal_address_view_flag',false);
                                }                                   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.update_field_value_after_set_properites');
                                return;
                        }
                };

                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_client_id = win.client_id;
                var _selected_client_reference_number = win.client_reference_number;
                var _client_type_code = win.client_type_code;
                var _client_name = '';
                var _client_abbr = '';
                var _client_mobile = '';
                var _client_phone = '';
                var _client_fax = '';
                var _client_email = '';
                var _client_skype_name = '';
                var _client_website = '';
                var _client_description = '';
                var _client_sub_number = '';
                var _client_unit_number = '';
                var _client_street_number = '';
                var _client_street = '';
                var _client_street_type = '';
                var _client_street_type_id = 0;
                var _client_suburb = '';
                var _client_suburb_id = 0;
                var _client_postcode = '';
                var _client_state = '';
                var _client_state_id = 2;
                var _client_postal_address = '';
                var _parent_win = win.parent_win;
                var _current_field_num=0;
                var _current_selected_row = null;
                var _is_make_changed = false;
                var _selected_field_object = null;
                var _is_client_name_content_field_focused = false;
                var _is_client_abbr_content_field_focused = false;
                var _is_client_mobile_content_field_focused = false;
                var _is_client_phone_content_field_focused = false;
                var _is_client_fax_content_field_focused = false;
                var _is_client_email_content_field_focused = false;
                var _is_client_website_content_field_focused = false;
                var _is_client_skype_content_field_focused = false;
                var _can_view_business_client = Titanium.App.Properties.getBool('can_view_business_client');
                //private method                
                
                            
                /**
                 *  init client type field
                 */
                function _init_client_type_field(){
                        try{
                                var client_type_name = '';
                                var is_required_field = true;
                                if(!_can_view_business_client){
                                        _client_type_code = 2;                                         
                                } 
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_client_type_code WHERE code=?',_client_type_code);
                                if(rows.isValidRow()){
                                        client_type_name = rows.fieldByName('name');
                                }     
                                rows.close();
                                db.close();                                  
                                if(_can_view_business_client){
                                        _current_field_num++;                                                                             
                                        var client_type_code_field = Ti.UI.createTableViewRow({
                                                client_type_code:_client_type_code,
                                                client_type_name:client_type_name,
                                                className:'set_client_type_code',
                                                filter_class:'set_client_type_code',
                                                valueRequired:is_required_field,//for check value
                                                valuePosition:3,//for check value
                                                valueType:'text',//for check value,
                                                valuePrompt:'Please enter client type.',//for check value
                                                height:self.default_table_view_row_height,
                                                hasChild:true
                                        });
                                        var client_type_title_field = Ti.UI.createLabel({
                                                text:'Type',
                                                color:self.font_color,
                                                font:{
                                                        fontSize:self.font_size,
                                                        fontWeight:self.font_weight
                                                },
                                                left:10
                                        });
                                        client_type_code_field.add(client_type_title_field);
                                        var client_name_content_required_text_label = Ti.UI.createLabel({
                                                right:10,
                                                height:self.default_table_view_row_height,
                                                width:self.set_a_field_width_in_table_view_row(client_type_title_field.text),
                                                textAlign:'right',
                                                text:(is_required_field)?'Required':'Optional',
                                                opacity:self.hint_text_font_opacity,
                                                color:self.hint_text_font_color,
                                                font:{
                                                        fontSize:self.normal_font_size
                                                }
                                        });
                                        client_type_code_field.add(client_name_content_required_text_label);
                                        var client_name_content_field = Ti.UI.createLabel({
                                                right:10,
                                                height:((client_type_name === '')||(client_type_name === null))?self.default_table_view_row_height:'auto',
                                                width:self.set_a_field_width_in_table_view_row(client_type_title_field.text),
                                                textAlign:'right',
                                                text:client_type_name,
                                                color:self.selected_value_font_color,
                                                font:{
                                                        fontSize:self.normal_font_size
                                                }
                                        });
                                        client_type_code_field.add(client_name_content_field);
                                        self.data.push(client_type_code_field);
                                        if((client_type_name === '')||(client_type_name === null)){
                                                client_name_content_field.visible = false;
                                        }else{
                                                client_name_content_required_text_label.visible = false;
                                        }
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_type_field');
                                return;
                        }
                }
                /**
                 *  init client name field
                 */
                function _init_client_name_field(){
                        try{
                                _current_field_num++;      
                                var field_num = _current_field_num;  
                                var is_required_field = true;
                                var client_name_field = Ti.UI.createTableViewRow({
                                        className:'set_client_name',
                                        filter_class:'set_client_name',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter client name.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var client_name_title_field = Ti.UI.createLabel({
                                        text:'Name',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                client_name_field.add(client_name_title_field);
                                var client_name_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(client_name_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                client_name_field.add(client_name_content_field);
                                self.data.push(client_name_field);
                                client_name_content_field.addEventListener('change',function(e){
                                        _client_name = e.value;
                                        _is_make_changed = true;
                                });
                                client_name_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                client_name_content_field.addEventListener('focus',function(e){                                        
                                        _is_client_name_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                client_name_content_field.addEventListener('blur',function(e){
                                        _is_client_name_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_name_field');
                                return; 
                        }                                   
                }
                /**
                 *  init client abbr field
                 */
                function _init_client_abbr_field(){
                        try{
                                _current_field_num++;      
                                var field_num = _current_field_num;
                                var is_required_field = false;
                                var client_abbr_field = Ti.UI.createTableViewRow({
                                        className:'set_client_abbr',
                                        filter_class:'set_client_abbr',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter client abbr.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var client_abbr_title_field = Ti.UI.createLabel({
                                        text:'Abbr',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                client_abbr_field.add(client_abbr_title_field);
                                var client_abbr_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(client_abbr_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_abbr,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                client_abbr_field.add(client_abbr_content_field);
                                self.data.push(client_abbr_field);
                                client_abbr_content_field.addEventListener('change',function(e){
                                        _client_abbr = e.value;
                                        _is_make_changed = true;
                                }); 
                                client_abbr_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                }); 
                                client_abbr_content_field.addEventListener('focus',function(e){                                        
                                        _is_client_abbr_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                client_abbr_content_field.addEventListener('blur',function(e){
                                        _is_client_abbr_content_field_focused = false;
                                        _selected_field_object = null;
                                }); 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_abbr_field');
                                return; 
                        }                                   
                }
                /**
                 *  init client mobile field
                 */                
                function _init_client_mobile_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;                                
                                var is_required_field = false;
                                var client_mobile_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_mobile',
                                        className:'set_client_mobile',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter mobile.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var client_mobile_title_field = Ti.UI.createLabel({
                                        text:'Mobile',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                client_mobile_field.add(client_mobile_title_field);
                                var client_mobile_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(client_mobile_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_mobile,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                client_mobile_field.add(client_mobile_content_field);
                                self.data.push(client_mobile_field);
                                client_mobile_content_field.addEventListener('change',function(e){
                                        _client_mobile = e.value;
                                        _is_make_changed = true;
                                });
                                client_mobile_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                client_mobile_content_field.addEventListener('focus',function(e){                                        
                                        _is_client_mobile_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                client_mobile_content_field.addEventListener('blur',function(e){
                                        _is_client_mobile_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_mobile_field');
                                return;
                        }                         
                }
                /**
                 *  init client phone field
                 */                
                function _init_client_phone_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;                                
                                var is_required_field = false;
                                var client_phone_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_phone',
                                        className:'set_client_phone',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter phone.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var client_phone_title_field = Ti.UI.createLabel({
                                        text:'Phone',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                client_phone_field.add(client_phone_title_field);
                                var client_phone_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(client_phone_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_phone,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                client_phone_field.add(client_phone_content_field);
                                self.data.push(client_phone_field);
                                client_phone_content_field.addEventListener('change',function(e){
                                        _client_phone = e.value;
                                        _is_make_changed = true;
                                });
                                client_phone_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                client_phone_content_field.addEventListener('focus',function(e){                                        
                                        _is_client_phone_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                client_phone_content_field.addEventListener('blur',function(e){
                                        _is_client_phone_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_phone_field');
                                return;
                        }                          
                }
                /**
                 *  init client fax field
                 */                
                function _init_client_fax_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;                                
                                var is_required_field = false;
                                var client_fax_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_fax',
                                        className:'set_client_fax',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter fax.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var client_fax_title_field = Ti.UI.createLabel({
                                        text:'Fax',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                client_fax_field.add(client_fax_title_field);
                                var client_fax_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(client_fax_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_fax,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                client_fax_field.add(client_fax_content_field);
                                self.data.push(client_fax_field);
                                client_fax_content_field.addEventListener('change',function(e){
                                        _client_fax = e.value;
                                        _is_make_changed = true;
                                });
                                client_fax_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                client_fax_content_field.addEventListener('focus',function(e){                                        
                                        _is_client_fax_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                client_fax_content_field.addEventListener('blur',function(e){
                                        _is_client_fax_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_fax_field');
                                return;
                        }                                   
                }
                /**
                 *  init client email field
                 */                
                function _init_client_email_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;                                  
                                var is_required_field = false;
                                var client_email_field = Ti.UI.createTableViewRow({
                                        className:'set_client_email',
                                        filter_class:'set_client_email',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter email.',//for check value
                                        valueCheckExtra:'email',
                                        valueCheckPrompt:'Wrong email format.',
                                        height:self.default_table_view_row_height
                                });
                                var client_email_title_field = Ti.UI.createLabel({
                                        text:'Email',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                client_email_field.add(client_email_title_field);
                                var client_email_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(client_email_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_email,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_EMAIL,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                client_email_field.add(client_email_content_field);
                                self.data.push(client_email_field);
                                client_email_content_field.addEventListener('change',function(e){
                                        _client_email = e.value;
                                        _is_make_changed = true;
                                });
                                client_email_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });  
                                client_email_content_field.addEventListener('focus',function(e){                                        
                                        _is_client_email_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                client_email_content_field.addEventListener('blur',function(e){
                                        _is_client_email_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_email_field');
                                return;
                        }                          
                }
                /**
                 *  init client website field
                 */                
                function _init_client_website_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;                                  
                                var is_required_field = false;
                                var client_website_field = Ti.UI.createTableViewRow({
                                        className:'set_client_website',
                                        filter_class:'set_client_website',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter website.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var client_website_title_field = Ti.UI.createLabel({
                                        text:'Website',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                client_website_field.add(client_website_title_field);
                                var client_website_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(client_website_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_website,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_URL,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                client_website_field.add(client_website_content_field);
                                self.data.push(client_website_field);
                                client_website_content_field.addEventListener('change',function(e){
                                        _client_website = e.value;
                                        _is_make_changed = true;
                                });
                                client_website_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                client_website_content_field.addEventListener('focus',function(e){                                        
                                        _is_client_website_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                client_website_content_field.addEventListener('blur',function(e){
                                        _is_client_website_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                    
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_website_field');
                                return;
                        }                         
                }                
                /**
                 *  init client skype field
                 */                
                function _init_client_skype_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;                                 
                                var is_required_field = false;
                                var client_skype_field = Ti.UI.createTableViewRow({
                                        className:'set_client_contact_skype',
                                        filter_class:'set_client_contact_skype',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter skype.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var client_skype_title_field = Ti.UI.createLabel({
                                        text:'Skype',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                client_skype_field.add(client_skype_title_field);
                                var client_skype_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(client_skype_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_skype_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_URL,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                client_skype_field.add(client_skype_content_field);
                                self.data.push(client_skype_field);
                                client_skype_content_field.addEventListener('change',function(e){
                                        _client_skype_name = e.value;
                                        _is_make_changed = true;
                                });
                                client_skype_content_field.addEventListener('focus',function(e){                                        
                                        _is_client_skype_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                client_skype_content_field.addEventListener('blur',function(e){
                                        _is_client_skype_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_skype_field');
                                return;
                        }                         
                }
                /**
                 *  init client address field
                 */
                function _init_client_address_field(){
                        try{
                                _current_field_num++; 
                                var is_required_field = false;
                                var address = '';
                                address = (_client_unit_number === null)?'':_client_unit_number;
                                if(address != ''){
                                        address+= (_client_sub_number === null)?'/ ':'-'+_client_sub_number+'/ ';
                                }
                                address += _client_street_number+' '+_client_street+'\n'+_client_suburb+(_client_postcode === ''?'':' '+_client_postcode);
                                if(_client_state != ''){
                                        address += '\n'+_client_state;
                                }
                                address = self.trim(address);
                                var addressField = Ti.UI.createTableViewRow({
                                        className:'set_client_address',
                                        client_sub_number:_client_sub_number,
                                        client_unit_number:_client_unit_number,
                                        client_street_number:_client_street_number,
                                        client_street:_client_street,
                                        client_suburb:_client_suburb,
                                        client_postcode:_client_postcode,
                                        client_state:_client_state,
                                        client_state_id:_client_state_id,
                                        hasChild:true,
                                        filter_class:'set_client_address',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value
                                        valuePrompt:'Please enter address.',//for check value
                                        height:'auto'
                                });
                                var addressTitleField = Ti.UI.createLabel({
                                        text:'Address',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                addressField.add(addressTitleField);

                                var addressContentRequiredTextLabel = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(addressTitleField.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                addressField.add(addressContentRequiredTextLabel);

                                var addressContentField = Ti.UI.createLabel({
                                        top:5,
                                        bottom:5,
                                        right:10,
                                        height:'auto',
                                        width:self.set_a_field_width_in_table_view_row(addressTitleField.text),
                                        textAlign:'right',
                                        text:address,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                addressField.add(addressContentField);

                                if((address === '')||(address === null)){
                                        addressContentField.visible = false;
                                }else{
                                        addressContentRequiredTextLabel.visible = false;
                                }
                                self.data.push(addressField);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_address_field');
                                return; 
                        }                                   
                }
                /**
                 *  init client description field
                 */
                function _init_client_description_field(){
                        try{
                                var is_required_field = false;
                                var client_client_description_field = Ti.UI.createTableViewRow({
                                        className:'set_client_client_description',
                                        filter_class:'set_client_client_description',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value
                                        valuePrompt:'Please enter description.',//for check value
                                        hasChild:true,
                                        height:'auto'
                                });
                                var client_description_title_field = Ti.UI.createLabel({
                                        text:'Description',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                client_client_description_field.add(client_description_title_field);
                                
                                var client_description_required_text_label = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(client_description_title_field.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                client_client_description_field.add(client_description_required_text_label);

                                self.data.push(client_client_description_field);                                

                                var client_description_content_field = Ti.UI.createLabel({
                                        top:5,
                                        bottom:5,
                                        right:10,
                                        height:'auto',
                                        width:self.set_a_field_width_in_table_view_row(client_description_title_field.text),
                                        textAlign:'right',
                                        text:_client_description,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                client_client_description_field.add(client_description_content_field);

                                if((_client_description === '')||(_client_description === null)){
                                        client_description_content_field.visible = false;
                                }else{
                                        client_description_required_text_label.visible = false;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_description_field');
                                return;
                        }                                
                }
                /** 
                 *  init client postal address field
                 */
                function _init_client_postal_address_field(){
                        try{
                                var is_required_field = false;
                                var client_postal_address_field = Ti.UI.createTableViewRow({
                                        className:'set_client_postal_address',
                                        filter_class:'set_client_postal_address',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value
                                        valuePrompt:'Please enter postal address.',//for check value
                                        height:'auto',
                                        hasChild:true
                                });
                                var postal_address_title_field = Ti.UI.createLabel({
                                        text:'Postal \nAddress',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                client_postal_address_field.add(postal_address_title_field);
                                
                                var postal_address_required_text_label = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(postal_address_title_field.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                client_postal_address_field.add(postal_address_required_text_label);                                

                                var postal_address_content_field = Ti.UI.createLabel({
                                        top:5,
                                        bottom:5,
                                        right:10,
                                        height:'auto',
                                        width:self.set_a_field_width_in_table_view_row(postal_address_title_field.text),
                                        textAlign:'right',
                                        text:_client_postal_address,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                client_postal_address_field.add(postal_address_content_field);
                                self.data.push(client_postal_address_field);
                                
                                if((_client_postal_address === '')||(_client_postal_address === null)){
                                        postal_address_content_field.visible =false;                                
                                }else{
                                        postal_address_required_text_label.visible = false;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_postal_address_field');
                                return;
                        }                                
                }
                /**
                 *  init client contact list button
                 */
                function _init_client_contacts_list_btn(){
                        try{
                                var contactsButtonField = Ti.UI.createTableViewRow({
                                        className:'set_contacts_button',
                                        filter_class:'set_contacts_button',
                                        header:'',
                                        valueRequired:false
                                });
                                var contactsButton = Ti.UI.createButton({
                                        title:'Contacts List',
                                        backgroundImage:self.get_file_path('image','BUTT_grn_off.png'),
                                        textAlign:'center',
                                        height:self.default_table_view_row_height,
                                        width:(self.is_ipad())?self.screen_width-self.ipad_button_reduce_length_in_tableview:self.screen_width-self.iphone_button_reduce_length_in_tableview
                                });
                                contactsButtonField.add(contactsButton);
                                self.data.push(contactsButtonField);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_contacts_list_btn');
                                return;
                        }                        
                }
                /**
                 *  init delete button
                 */
                function _init_delete_btn(){
                        try{
                                var deleteButtonField = Ti.UI.createTableViewRow({
                                        className:'set_delete_button',
                                        filter_class:'set_delete_button',
                                        header:'',
                                        valueRequired:false
                                });
                                var deleteButton = Ti.UI.createButton({
                                        title:'Delete',
                                        backgroundImage:self.get_file_path('image', 'BUTT_red_off.png'),
                                        textAlign:'center',
                                        height:self.default_table_view_row_height,
                                        width:(self.is_ipad())?self.screen_width-self.ipad_button_reduce_length_in_tableview:self.screen_width-self.iphone_button_reduce_length_in_tableview
                                });
                                deleteButtonField.add(deleteButton);
                                self.data.push(deleteButtonField);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_delete_btn');
                                return; 
                        }                                       
                }
                /**
                 *  check if did any change for client field
                 */
                function _check_if_make_change(){
                        try{
                                var is_make_changed = false;
                                if(_is_make_changed){
                                        is_make_changed = true;
                                }else{
                                        //check if make any change
                                        //if make any change then prompt to save or update
                                        //else return to "view job" page
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_client WHERE id=?',_selected_client_id);
                                        if(_client_name != rows.fieldByName('client_name')){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_abbr != rows.fieldByName('client_abbr'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_type_code != rows.fieldByName('client_type_code'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_mobile != rows.fieldByName('phone_mobile'))){
                                                is_make_changed = true;
                                        }  
                                        if((!is_make_changed)&&(_client_phone != rows.fieldByName('phone'))){
                                                is_make_changed = true;
                                        }  
                                        if((!is_make_changed)&&(_client_fax != rows.fieldByName('fax'))){
                                                is_make_changed = true;
                                        }      
                                        if((!is_make_changed)&&(_client_skype_name != rows.fieldByName('skype_name'))){
                                                is_make_changed = true;
                                        }     
                                        if((!is_make_changed)&&(_client_email != rows.fieldByName('email'))){
                                                is_make_changed = true;
                                        }         
                                        if((!is_make_changed)&&(_client_website != rows.fieldByName('website'))){
                                                is_make_changed = true;
                                        } 
                                        if((!is_make_changed)&&(_client_sub_number != rows.fieldByName('sub_number'))){
                                                is_make_changed = true;
                                        }  
                                        if((!is_make_changed)&&(_client_unit_number != rows.fieldByName('unit_number'))){
                                                is_make_changed = true;
                                        } 
                                        if((!is_make_changed)&&(_client_street_number != rows.fieldByName('street_number'))){
                                                is_make_changed = true;
                                        } 
                                        if((!is_make_changed)&&(_client_street != rows.fieldByName('street'))){
                                                is_make_changed = true;
                                        } 
                                        if((!is_make_changed)&&(_client_suburb != rows.fieldByName('suburb'))){
                                                is_make_changed = true;
                                        } 
                                        if((!is_make_changed)&&(_client_postcode != rows.fieldByName('postcode'))){
                                                is_make_changed = true;
                                        }                                          
                                        if((!is_make_changed)&&(_client_state_id != rows.fieldByName('locality_state_id'))){
                                                is_make_changed = true;
                                        }   
                                        if((!is_make_changed)&&(_client_description != rows.fieldByName('description'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_postal_address != rows.fieldByName('postal_address'))){
                                                is_make_changed = true;
                                        }
                                        rows.close();
                                        db.close();
                                }
                                return is_make_changed;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_make_change');
                                return false; 
                        }                                   
                }
                /**
                 *   delete record from my_client table if not to save it.
                 */
                function _clean_database_and_file(client_id){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                db.execute('delete from my_client where id=?',client_id);
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _clean_database_and_file');
                                return; 
                        }                                   
                } 
                /**
                 *  event list
                 */
                function _display_client_type_edit_page(e){
                        try{
                                var client_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','base/select_unique_code_from_table_view.js'),
                                        win_title:'Select Client Type',
                                        table_name:'my_client_type_code',//table name
                                        display_name:'name',//need to shwo field
                                        content:e.row.client_type_code,
                                        content_value:e.row.client_type_name,
                                        source:'edit_client'
                                });
                                Titanium.UI.currentTab.open(client_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_client_type_edit_page');
                                return;
                        }                                   
                }                
                /**
                 * display address edit page
                 */
                function _display_address_edit_page(e){
                        try{
                                var address_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'base/edit_address.js'),
                                        sub_number:_client_sub_number,
                                        unit_number:_client_unit_number,
                                        street_number:_client_street_number,
                                        street:_client_street,
                                        street_type:_client_street_type,
                                        suburb:_client_suburb,
                                        postcode:_client_postcode,
                                        stateID:_client_state_id,
                                        state:_client_state
                                });
                                Titanium.UI.currentTab.open(address_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_address_edit_page');
                                return; 
                        }                                   
                }
                /**
                 * display description edit page
                 */
                function _display_description_edit_page(e){
                        try{
                                var address_win = Ti.UI.createWindow({
                                        title:'Edit Description',
                                        url:self.get_file_path('url', 'base/edit_textarea_field.js'),
                                        content:_client_description,
                                        source:'edit_client_description'
                                });
                                Titanium.UI.currentTab.open(address_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_description_edit_page');
                                return; 
                        }                                   
                }          
                /**
                 * display postal address edit page
                 */
                function _display_postal_address_edit_page(e){
                        try{
                                var address_win = Ti.UI.createWindow({
                                        title:'Edit Postal Address',
                                        url:self.get_file_path('url', 'base/edit_textarea_field.js'),
                                        content:_client_postal_address,
                                        source:'edit_client_postal_address'
                                });
                                Titanium.UI.currentTab.open(address_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_postal_address_edit_page');
                                return; 
                        }                                   
                }                       
                /**
                 * display client contact list
                 */
                function _display_client_contacts_list(e){
                        try{
                                var client_contact_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'client_contact/client_contact_list.js'),
                                        client_id:_selected_client_id
                                });
                                Ti.UI.currentTab.open(client_contact_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_client_contacts_list');
                                return; 
                        }                                   
                }
                /** 
                 * delete button click event
                 */
                function _delete_btn_click_event(){
                        try{
                                var optionDialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['YES','NO','']:['YES','NO'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:1,
                                        title:L('message_delete_client_in_edit_client_for_select_type')
                                });
                                optionDialog.show();
                                optionDialog.addEventListener('click',function(e){
                                        if(e.index == 0){
                                                if(_selected_client_id > 1000000000){
                                                        var db = Titanium.Database.open(self.get_db_name());
                                                        db.execute('DELETE FROM my_client WHERE id=?',_selected_client_id);
                                                        db.close();
                                                        if(_parent_win != null){
                                                                _parent_win.close();
                                                        }
                                                        win.close();
                                                }else{
                                                        if(!Ti.Network.online){
                                                                self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                                return; 
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
                                                                                self.update_selected_tables(null,'Client',JSON.parse(this.responseText));  
                                                                                self.update_selected_tables(null,'Summary',JSON.parse(this.responseText));  
                                                                                if(_parent_win != null){
                                                                                        //self.close_window(_parent_win);
                                                                                        _parent_win.close();
                                                                                }                         
                                                                                win.close();
                                                                        }else{
                                                                                var params = {
                                                                                        message:'Remove client failed.',
                                                                                        show_message:true,
                                                                                        message_title:'',
                                                                                        send_error_email:true,
                                                                                        error_message:'',
                                                                                        error_source:window_source+' - _delete_btn_click_event - xhr.onload -1',
                                                                                        server_response_message:this.responseText
                                                                                };
                                                                                self.processXYZ(params);
                                                                                return; 
                                                                        }
                                                                }catch(e){
                                                                        params = {
                                                                                message:'Remove client failed.',
                                                                                show_message:true,
                                                                                message_title:'',
                                                                                send_error_email:true,
                                                                                error_message:e,
                                                                                error_source:window_source+' - _delete_btn_click_event - xhr.onload -2',
                                                                                server_response_message:this.responseText
                                                                        };
                                                                        self.processXYZ(params);                                                                        
                                                                        return; 
                                                                }                            

                                                        };
                                                        xhr.onerror = function(e){
                                                                self.hide_indicator();
                                                                var params = {
                                                                        message:'Remove client failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:e,
                                                                        error_source:window_source+' - _delete_btn_click_event - xhr.onerror',
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
                                                                'type':'remove_client',
                                                                'hash':_selected_user_id,
                                                                'id':_selected_client_id,
                                                                'user_id':_selected_user_id,
                                                                'company_id':_selected_company_id,
                                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                                'app_version_increment':self.version_increment,
                                                                'app_version':self.version,
                                                                'app_platform':self.get_platform_info()
                                                        });

                                                }
                                        }
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _delete_btn_click_event');
                                return; 
                        }                                   
                }
        }

        win.addEventListener('focus',function(){
                try{
                        if(client_edit_client_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                client_edit_client_page.prototype = new F();
                                client_edit_client_page.prototype.constructor = client_edit_client_page;
                                client_edit_client_page_obj = new client_edit_client_page();
                                client_edit_client_page_obj.init();
                        }else{
                                client_edit_client_page_obj.update_field_value_after_set_properites(); 
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        client_edit_client_page_obj.close_window();
                        client_edit_client_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());