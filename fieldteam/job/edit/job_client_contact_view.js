//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_client_contact_view_page_obj = null;

        function job_client_contact_view_page(){
                var self = this;
                var window_source = 'job_client_contact_view_page';
                win.title = 'Client Contact';

                //public method
                /**
                 *  override init  function of parent class: fieldteam.js
                 */                     
                self.init = function(){
                        try{   
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Edit','Main,Back');
                                self.init_vars();                               
                                _init_contact_person_name_section();
                                _init_contact_person_primary_phone_field();
                                _init_contact_person_secondary_phone_field();
                                _init_contact_person_fax_field();
                                _init_contact_person_email_field();
                                _init_contact_person_skype_field();
                                _init_contact_person_website_field();
                                _init_contact_person_note_field();
                                
                                self.init_table_view();//inherite init_table_view function from parent class
                                self.init_no_result_label();//inherite init_no_result_label function from parent class
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }              
                };
                /**
                 *  override init_vars  function of parent class: fieldteam.js
                 */                   
                self.init_vars = function(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                
                                var temp_var = {};
                                var row = db.execute('SELECT * FROM my_salutation_code WHERE code>0');
                                if(row != null){
                                        while(row.isValidRow()){
                                                temp_var = {
                                                        code:row.fieldByName('code'),
                                                        name:row.fieldByName('name')
                                                };
                                                _salutation_code_array.push(temp_var);
                                                row.next();
                                        }
                                        row.close();
                                }                                     
                                                                                               
                                var rows = db.execute('SELECT * FROM my_client_contact WHERE id=?',_client_contact_id);
                                if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                        _display_name = rows.fieldByName('display_name');
                                        _first_name = rows.fieldByName('first_name');
                                        _last_name = rows.fieldByName('last_name');
                                        _position= rows.fieldByName('position');
                                        _mobile = rows.fieldByName('phone_mobile');
                                        _phone = rows.fieldByName('phone');
                                        _fax = rows.fieldByName('fax');
                                        _email = rows.fieldByName('email');
                                        _website = rows.fieldByName('website');
                                        _skype = rows.fieldByName('skype_name');
                                        _note = rows.fieldByName('note');
                                }
                                rows.close();
                                db.close();                                
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
                                var edit_client_contact_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'client_contact/edit_client_contact.js'),
                                        client_id:_client_id,
                                        client_contact_id:_client_contact_id,
                                        action_for_client_contact:'edit_client_contact',
                                        parent_source:'client_contact_view',
                                        parent_win:win,
                                        source:win.source
                                });
                                Titanium.UI.currentTab.open(edit_client_contact_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        } 
                };                      
                /**
                 *  override table_view_click_event  function of parent class: fieldteam.js
                 */                      
                self.table_view_click_event = function(e){
                        try{
                                if(_selected_job_id > 1000000000){
                                        self.show_message('Please save '+_type+' before executing any action.');
                                        return;
                                }
                                switch(e.row.type){
                                        case 'mobile':
                                                _event_for_mobile_type(e);
                                                break;
                                        case 'phone':
                                                _event_for_phone_type(e);
                                                break;
                                        case 'email':
                                                _event_for_email_type(e);
                                                break;
                                        case 'skype':
                                                _event_for_skype_type(e);
                                                break;
                                        case 'website':
                                                _event_for_website_type(e);
                                                break;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                                         
                };       
                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _client_contact_id = win.client_contact_id;
                var _client_id = win.client_id;
                var _first_name = '';
                var _last_name = '';
                var _position = '';
                var _mobile = '';
                var _phone = '';
                var _fax = '';
                var _email = '';
                var _website = '';
                var _skype = '';
                var _note = '';
                var _display_name = '';
                var _salutation_code_array = [];

                //private method
                /**
                 *  init contact person name section
                 */
                function _init_contact_person_name_section(){
                        try{
                                var no_position_flag = false;
                                if((_position === null)||(_position === '')){
                                        no_position_flag = true;
                                }                                
                                var contact_person_name_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_contact_name',
                                        className:'set_client_contact_name',
                                        height:self.default_table_view_row_height,
                                        type:'name',
                                        text_value:_first_name+' '+_last_name
                                });
                                var contact_person_name_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Name',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                contact_person_name_field.add(contact_person_name_title_field);
                                var contact_person_name_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:(!no_position_flag?'['+_position+'] ':'')+_first_name+' '+_last_name,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                contact_person_name_field.add(contact_person_name_content_field);                                
                                self.data.push(contact_person_name_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_name_section');
                                return;
                        }                                  
                }
                /**
                 *  init contact person primary phone field
                 */                
                function _init_contact_person_primary_phone_field(){
                        try{
                                var contact_person_primary_phone_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_contact_primary_contact',
                                        className:'set_client_contact_primary_contact',
                                        height:self.default_table_view_row_height,
                                        type:'mobile',
                                        text_value:_mobile
                                });
                                var contact_person_primary_phone_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Mobile',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                contact_person_primary_phone_field.add(contact_person_primary_phone_title_field);
                                var contact_person_primary_phone_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_mobile,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                contact_person_primary_phone_field.add(contact_person_primary_phone_content_field);
                                self.data.push(contact_person_primary_phone_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_primary_phone_field');
                                return;
                        }                                  
                }
                /**
                 *  init contact person secondary phone field
                 */                    
                function _init_contact_person_secondary_phone_field(){
                        try{
                                var contact_person_secondary_phone_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_contact_secondary_contact',
                                        className:'set_client_contact_secondary_contact',
                                        height:self.default_table_view_row_height,
                                        type:'phone',
                                        text_value:_phone
                                });
                                var contact_person_secondary_phone_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Phone',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                contact_person_secondary_phone_field.add(contact_person_secondary_phone_title_field);
                                var contact_person_secondary_phone_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_phone,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                contact_person_secondary_phone_field.add(contact_person_secondary_phone_content_field);
                                self.data.push(contact_person_secondary_phone_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_secondary_phone_field');
                                return;
                        }                                  
                }
                /**
                 *  init contact person fax field
                 */                    
                function _init_contact_person_fax_field(){
                        try{
                                var contact_person_fax_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_contact_fax',
                                        className:'set_client_contact_fax',
                                        height:self.default_table_view_row_height,
                                        type:'fax',
                                        text_value:_fax
                                });
                                var contact_person_fax_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Fax',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                contact_person_fax_field.add(contact_person_fax_title_field);
                                var contact_person_fax_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_fax,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                contact_person_fax_field.add(contact_person_fax_content_field);
                                self.data.push(contact_person_fax_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_fax_field');
                                return;
                        }                                  
                }
                /**
                 *  init contact person email field
                 */                    
                function _init_contact_person_email_field(){
                        try{
                                var contact_person_email_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_contact_email',
                                        className:'set_client_contact_email',
                                        height:self.default_table_view_row_height,
                                        type:'email',
                                        text_value:_email
                                });
                                var contact_person_email_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Email',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                contact_person_email_field.add(contact_person_email_title_field);
                                var contact_person_email_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_email,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                contact_person_email_field.add(contact_person_email_content_field);
                                self.data.push(contact_person_email_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_email_field');
                                return;
                        }                                  
                }
                /**
                 *  init contact person skype field
                 */    
                function _init_contact_person_skype_field(){
                        try{
                                var contact_person_skype_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_contact_skype',
                                        className:'set_client_contact_skype',
                                        height:self.default_table_view_row_height,
                                        type:'skype',
                                        text_value:_skype
                                });
                                var contact_person_skype_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Skype',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                contact_person_skype_field.add(contact_person_skype_title_field);
                                var contact_person_skype_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_skype,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                contact_person_skype_field.add(contact_person_skype_content_field);
                                self.data.push(contact_person_skype_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_skype_field');
                                return;
                        }                                  
                }
                /**
                 *  init contact person website field
                 */                    
                function _init_contact_person_website_field(){
                        try{
                                var contact_person_website_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_contact_website',
                                        className:'set_client_contact_website',
                                        height:self.default_table_view_row_height,
                                        type:'website',
                                        text_value:_website
                                });
                                var contact_person_website_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Website',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                contact_person_website_field.add(contact_person_website_title_field);
                                var contact_person_website_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_website,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                contact_person_website_field.add(contact_person_website_content_field);
                                self.data.push(contact_person_website_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_website_field');
                                return;
                        }                                  
                }
                /**
                 *  init contact person note field
                 */                    
                function _init_contact_person_note_field(){
                        try{
                                var contact_person_note_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_contact_note',
                                        className:'set_client_contact_note',
                                        height:'auto',
                                        type:'note'
                                });
                                var contact_person_note_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Note',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                contact_person_note_field.add(contact_person_note_title_field);
                                var contact_person_note_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_note,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:'auto'
                                });
                                contact_person_note_field.add(contact_person_note_content_field);
                                self.data.push(contact_person_note_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_note_field');
                                return;
                        }                                  
                }
                                
                //event list for different type
                function _event_for_mobile_type(e){
                        try{
                                var phone_str = self.remove_all_charaters_from_string(e.row.text_value);
                                if(isNaN(phone_str) || (phone_str == '')){
                                        self.show_message(L('message_invalid_phone_number'));
                                        return;
                                }
                                var recipients = [];
                                var option_dialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['SMS','Call','Cancel','']:['SMS','Call','Cancel'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:2,
                                        title:L('message_select_option')
                                });
                                option_dialog.show();
                                option_dialog.addEventListener('click',function(evt){
                                        var temp_type_text = '';
                                        if(evt.index === 0){//sms
                                                temp_type_text = 'sms';
                                        }
                                        if(evt.index === 1){//sms
                                                temp_type_text = 'call';
                                        }
                                        if(temp_type_text != ''){
                                                var tmp_var = {
                                                        display_content:e.row.text_value,
                                                        content:phone_str,
                                                        name:_display_name,
                                                        source:'client_contact',
                                                        source_id:_client_contact_id
                                                };
                                                recipients.push(tmp_var);
                                                self.action_events(_type,temp_type_text,_selected_job_id,_selected_job_reference_number,JSON.stringify(recipients));
                                        }
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_mobile_type');
                                return;
                        }                                         
                }
                function _event_for_phone_type(e){
                        try{
                                var phone_str = self.remove_all_charaters_from_string(e.row.text_value);
                                if(isNaN(phone_str) || (phone_str == '')){
                                        self.show_message(L('message_invalid_phone_number'));
                                        return;
                                }
                                var recipients = [];
                                var temp_type_text = 'call';
                                if(temp_type_text != ''){
                                        var tmp_var = {
                                                display_content:e.row.text_value,
                                                content:phone_str,
                                                name:_display_name,
                                                source:'client_contact',
                                                source_id:_client_contact_id
                                        };
                                        recipients.push(tmp_var);
                                        self.action_events(_type,temp_type_text,_selected_job_id,_selected_job_reference_number,JSON.stringify(recipients));
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_phone_type');
                                return;
                        }                                         
                }
                function _event_for_email_type(e){
                        try{
                                if(!self.check_valid_email(e.row.text_value)){
                                        self.show_message(L('message_invalid_email'));
                                        return;
                                }
                                var recipients = [];
                                var temp_type_text = 'email';
                                if(temp_type_text != ''){
                                        var tmp_var = {
                                                content:e.row.text_value,
                                                name:_display_name,
                                                source:'client_contact',
                                                source_id:_client_contact_id
                                        };
                                        recipients.push(tmp_var);
                                        self.action_events(_type,temp_type_text,_selected_job_id,_selected_job_reference_number,JSON.stringify(recipients));
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_email_type');
                                return;
                        }                                         
                }
                function _event_for_skype_type(e){
                        try{
                                Ti.Platform.openURL('skype:'+e.row.text_value);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_skype_type');
                                return;
                        }                                 
                }
                function _event_for_website_type(e){
                        try{
                                Ti.Platform.openURL('url:'+e.row.text_value);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_website_type');
                                return;
                        }                                         
                }
        }

        win.addEventListener('focus',function(){
                try{
                        if(job_client_contact_view_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_client_contact_view_page.prototype = new F();
                                job_client_contact_view_page.prototype.constructor = job_client_contact_view_page;
                                job_client_contact_view_page_obj = new job_client_contact_view_page();
                                job_client_contact_view_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }                          
        });

        win.addEventListener('close',function(){
                try{
                        job_client_contact_view_page_obj.close_window();
                        job_client_contact_view_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());


