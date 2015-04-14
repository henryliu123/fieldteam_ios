//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_site_contact_view_page_obj = null;

        function job_site_contact_view_page(){
                var self = this;
                var window_source = 'job_site_contact_view_page';
                win.title = 'Site Contact';

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
                                _init_contact_person_mobile_field();            
                                _init_contact_person_phone_work_field();
                                _init_contact_person_phone_field();
                                _init_contact_person_email_field();
                                _init_contact_person_note_field();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
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
                                var rows = db.execute('SELECT * FROM my_'+_type+'_site_contact WHERE id=?',_site_contact_id);
                                if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                        _display_name = rows.fieldByName('display_name');
                                        _first_name = rows.fieldByName('first_name');
                                        _last_name = rows.fieldByName('last_name');
                                        _phone_mobile = rows.fieldByName('phone_mobile');
                                        _phone = rows.fieldByName('phone');
                                        _phone_work = rows.fieldByName('phone_work');
                                        _email = rows.fieldByName('email');
                                        _note = rows.fieldByName('note');
                                        _is_primary_contact = rows.fieldByName('is_primary_contact');

                                        var row = db.execute('SELECT * FROM my_salutation_code WHERE code=? and code>0',rows.fieldByName('salutation_code'));
                                        if((row.getRowCount() > 0) && (row.isValidRow())){
                                                _person_title = (row.fieldByName('name') == '')?'':row.fieldByName('name')+' ';
                                        }
                                        row.close();
                                }
                                rows.close();
                                db.close();                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
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
                                if(e.row.type === 'mobile'){
                                        _event_for_mobile_type(e);
                                }
                                if(e.row.type === 'phone'){
                                        _event_for_phone_type(e);
                                }
                                if(e.row.type === 'phone_work'){
                                        _event_for_phone_work_type(e);
                                }
                                if(e.row.type === 'email'){
                                        _event_for_email_type(e);
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                           
                };
                /**
                 *  override nav_right_btn_click_event  function of parent class: fieldteam.js
                 */                       
                self.nav_right_btn_click_event = function(e){
                        try{
                                var edit_site_contact_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','job/base/job_site_contact.js'),
                                        type:_type,
                                        job_id:_selected_job_id,
                                        job_site_contact_id:_site_contact_id,
                                        action_for_site_contact:'edit_job_site_contact',
                                        parent_win:win
                                });
                                Titanium.UI.currentTab.open(edit_site_contact_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }                         
                };                                 
                
                
                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _site_contact_id = win.site_contact_id;
                var _person_title = '';
                var _first_name = '';
                var _last_name = '';
                var _phone_mobile = '';
                var _phone = '';
                var _phone_work = '';
                var _email = '';
                var _note = '';
                var _display_name = '';
                var _is_primary_contact = false;

                //private method
                /**
                 *  init contact person name section
                 */
                function _init_contact_person_name_section(){
                        try{
                                var contact_person_name_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_site_contact_name',
                                        className:'set_site_contact_name',
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
                                        text:_person_title+_first_name+' '+_last_name+(_is_primary_contact?' [Primary Contact]':''),
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
                 *  init contact person mobile section
                 */                
                function _init_contact_person_mobile_field(){
                        try{
                                var contact_person_mobile_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_site_contact_mobile',
                                        className:'set_site_contact_mobile',
                                        height:self.default_table_view_row_height,
                                        type:'mobile',
                                        text_value:_phone_mobile
                                });
                                var contact_person_mobile_title_field = Ti.UI.createLabel({
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
                                contact_person_mobile_field.add(contact_person_mobile_title_field);
                                var contact_person_mobile_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_phone_mobile,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                contact_person_mobile_field.add(contact_person_mobile_content_field);
                                self.data.push(contact_person_mobile_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_mobile_field');
                                return;
                        }                                
                }
                /**
                 *  init contact person phone section
                 */                
                function _init_contact_person_phone_field(){
                        try{
                                var contact_person_phone_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_site_contact_phone',
                                        className:'set_site_contact_phone',
                                        height:self.default_table_view_row_height,
                                        type:'phone',
                                        text_value:_phone
                                });
                                var contact_person_phone_title_field = Ti.UI.createLabel({
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
                                contact_person_phone_field.add(contact_person_phone_title_field);
                                var contact_person_phone_content_field = Ti.UI.createLabel({
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
                                contact_person_phone_field.add(contact_person_phone_content_field);
                                self.data.push(contact_person_phone_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_phone_field');
                                return;
                        }                                
                }
                /**
                 *  init contact person work phone section
                 */                
                function _init_contact_person_phone_work_field(){
                        try{
                                var contact_person_phone_work_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_site_contact_phone_work',
                                        className:'set_site_contact_phone_work',
                                        height:self.default_table_view_row_height,
                                        type:'phone_work',
                                        text_value:_phone_work
                                });
                                var contact_person_phone_worj_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Work \nPhone',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                contact_person_phone_work_field.add(contact_person_phone_worj_title_field);
                                var contact_person_phone_work_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_phone_work,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                contact_person_phone_work_field.add(contact_person_phone_work_content_field);
                                self.data.push(contact_person_phone_work_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_phone_work_field');
                                return;
                        }                                
                }
                /**
                 *  init contact person email section
                 */                
                function _init_contact_person_email_field(){
                        try{
                                var contact_person_email_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_site_contact_email',
                                        className:'set_site_contact_email',
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
                 *  init contact person note section
                 */                
                function _init_contact_person_note_field(){
                        try{
                                var contact_person_note_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_site_contact_note',
                                        className:'set_site_contact_note',
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
                /**
                 *  event list for different type operation.
                 */
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
                                                        source:'site_contact',
                                                        source_id:_site_contact_id
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
                                                source:'site_contact',
                                                source_id:_site_contact_id
                                        };
                                        recipients.push(tmp_var);
                                        self.action_events(_type,temp_type_text,_selected_job_id,_selected_job_reference_number,JSON.stringify(recipients));
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_phone_type');
                                return;
                        }                                
                }
                function _event_for_phone_work_type(e){
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
                                                source:'site_contact',
                                                source_id:_site_contact_id
                                        };
                                        recipients.push(tmp_var);
                                        self.action_events(_type,temp_type_text,_selected_job_id,_selected_job_reference_number,JSON.stringify(recipients));
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_phone_work_type');
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
                                                source:'site_contact',
                                                source_id:_site_contact_id
                                        };
                                        recipients.push(tmp_var);
                                        self.action_events(_type,temp_type_text,_selected_job_id,_selected_job_reference_number,JSON.stringify(recipients));
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_email_type');
                                return;
                        }                                
                }
        }
    
        win.addEventListener('focus',function(){  
                try{
                        if(job_site_contact_view_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_site_contact_view_page.prototype = new F();
                                job_site_contact_view_page.prototype.constructor = job_site_contact_view_page;
                                job_site_contact_view_page_obj = new job_site_contact_view_page();
                                job_site_contact_view_page_obj.init();
                        }else{
                                job_site_contact_view_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }                        
        });

        win.addEventListener('close',function(){
                try{
                        job_site_contact_view_page_obj.close_window();
                        job_site_contact_view_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                        
        });
}());


