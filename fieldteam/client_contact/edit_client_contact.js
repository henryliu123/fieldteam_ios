/**
 *  Description: client_contact editor
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;   
        var client_contact_edit_client_contact_page_obj = null;

        function client_contact_edit_client_contact_page(){
                var self = this;
                var window_source = 'client_contact_edit_client_contact_page';
                if(win.action_for_client_contact == 'edit_client_contact'){
                        win.title = 'Edit Client Contact';
                }else{
                        win.title = 'Add Client Contact';
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
                                _init_contact_person_title_field();
                                _init_contact_person_first_name_field();
                                _init_contact_person_last_name_field();
                                _init_contact_person_position_field();
                                _init_contact_person_primary_phone_field();
                                _init_contact_person_secondary_phone_field();
                                _init_contact_person_fax_field();
                                _init_contact_person_email_field();
                                _init_contact_person_website_field();
                                _init_contact_person_skype_field();
                                _init_contact_person_note_field();
                                //                                if(_action_for_client_contact == 'edit_client_contact'){
                                //                                        if((win.source != undefined) && (win.source === 'job_index_view')){                                                
                                //                                        }else{
                                //                                                _init_delete_btn();
                                //                                        }
                                //                                }       
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();     
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_is_first_name_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_last_name_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_postion_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_primary_phone_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_secondary_phone_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }   
                                        if(_is_phone_fax_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_email_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }     
                                        if(_is_website_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }  
                                        if(_is_skype_content_field_focused && (_selected_field_object != null)){
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
                                if(_action_for_client_contact == 'add_client_contact'){
                                        var d= new Date();
                                        _selected_client_contact_id = parseInt(d.getTime(),10);
                                }

                                if(_action_for_client_contact == 'edit_client_contact'){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var client_contactObj = db.execute('SELECT * FROM my_client_contact WHERE id=?',_selected_client_contact_id);
                                        if(client_contactObj.getRowCount() > 0){
                                                if(client_contactObj.isValidRow()){
                                                        _client_contact_title_id = client_contactObj.fieldByName('salutation_code');
                                                        _client_contact_first_name = client_contactObj.fieldByName('first_name');
                                                        _client_contact_last_name = client_contactObj.fieldByName('last_name');
                                                        _client_contact_position = client_contactObj.fieldByName('position');
                                                        _client_contact_phone_mobile = client_contactObj.fieldByName('phone_mobile');
                                                        _client_contact_phone = client_contactObj.fieldByName('phone');
                                                        _client_contact_fax = client_contactObj.fieldByName('fax');
                                                        _client_contact_skype_name = client_contactObj.fieldByName('skype_name');
                                                        _client_contact_email = client_contactObj.fieldByName('email');
                                                        _client_contact_website = client_contactObj.fieldByName('website');
                                                        _client_contact_note = client_contactObj.fieldByName('note');
                                                }
                                        }
                                        client_contactObj.close();
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
                                if(!_check_if_make_change()){
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
                                _save(e);
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
                                if(!_check_if_make_change()){
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
                                        title:'Do you want to save this client contact?'
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
                                        case 'set_client_contact_title':
                                                _event_contact_person_title(e);
                                                break;
                                        case 'set_delete_button':
                                                _event_delete_btn();
                                                break;
                                        case 'set_client_contact_first_name':
                                        case 'set_client_contact_last_name':
                                        case 'set_client_contact_position':
                                        case 'set_client_contact_primary_contact':
                                        case 'set_client_contact_secondary_contact':
                                        case 'set_client_contact_fax':
                                        case 'set_client_contact_email':
                                        case 'set_client_contact_website':
                                        case 'set_client_contact_skype':
                                                self.check_and_set_object_focus(0,index,1);
                                                break;
                                        case 'set_client_contact_note':
                                                _event_contact_person_note(e);
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
                                if(Ti.App.Properties.getBool('update_unique_code_edit_client_contact_view_flag')){
                                        _client_contact_title_id = Ti.App.Properties.getString('update_unique_code_edit_client_contact_view_id');
                                        if(_current_selected_row != null){
                                                _current_selected_row.client_contact_title_id = _client_contact_title_id;
                                                _current_selected_row.person_title = Ti.App.Properties.getString('update_unique_code_edit_client_contact_view_content');
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _current_selected_row.person_title;
                                                if((_current_selected_row.person_title === '')||(_current_selected_row.person_title === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_unique_code_edit_client_contact_view_flag',false);
                                }        
                                if(Ti.App.Properties.getBool('update_edit_textarea_field_edit_client_contact_note_view_flag')){                                         
                                        _client_contact_note = Ti.App.Properties.getString('update_edit_textarea_field_edit_client_contact_note_view_content');
                                        if(_current_selected_row != null){
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _client_contact_note;
                                                if((_client_contact_note === '')||( _client_contact_note === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_edit_textarea_field_edit_client_contact_note_view_flag',false);
                                }                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.update_field_value_after_set_properites');
                                return;
                        }
                };                

                //private member
                var _action_for_client_contact = win.action_for_client_contact;
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_client_contact_id = win.client_contact_id;
                var _selected_client_id = win.client_id;
                var _client_contact_title_id = 0;
                var _client_contact_first_name = '';
                var _client_contact_last_name = '';
                var _client_contact_position= '';
                var _client_contact_phone_mobile= '';
                var _client_contact_phone= '';
                var _client_contact_fax= '';
                var _client_contact_skype_name= '';
                var _client_contact_email= '';
                var _client_contact_website= '';
                var _client_contact_note = '';
                var _parent_source = win.parent_source;
                var _parent_win = win.parent_win;
                var _current_field_num = 0;
                var _current_selected_row = null;
                var _is_make_changed = false;
                var _selected_field_object = null;
                var _is_first_name_content_field_focused = false;
                var _is_last_name_content_field_focused = false;
                var _is_postion_content_field_focused = false;
                var _is_primary_phone_content_field_focused = false;
                var _is_secondary_phone_content_field_focused = false;
                var _is_phone_fax_content_field_focused = false;
                var _is_email_content_field_focused = false;
                var _is_website_content_field_focused = false;      
                var _is_skype_content_field_focused = false;  
                //private method
                /**
                 *  init contact person title field
                 */
                function _init_contact_person_title_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = false;
                                var person_title = '';
                                if(_action_for_client_contact == 'edit_client_contact'){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_salutation_code WHERE code=? and code>0',_client_contact_title_id);
                                        if(rows.getRowCount() > 0){
                                                if(rows.isValidRow()){
                                                        person_title = (rows.fieldByName('name') == '')?'':rows.fieldByName('name');
                                                }
                                        }
                                        rows.close();
                                        db.close();
                                }
                                var person_title_field = Ti.UI.createTableViewRow({
                                        client_contact_title_id:_client_contact_title_id,
                                        person_title:person_title,
                                        className:'set_client_contact_title',
                                        filter_class:'set_client_contact_title',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value,
                                        valuePrompt:'Please select title.',//for check value
                                        hasChild:true,
                                        header:'',
                                        height:((person_title === '')||(person_title === null))?self.default_table_view_row_height:'auto'
                                });
                                var person_title_title_field = Ti.UI.createLabel({
                                        text:'Title',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                person_title_field.add(person_title_title_field);

                                var person_title_required_text_label = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(person_title_title_field.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                person_title_field.add(person_title_required_text_label);

                                var person_title_content_field = Ti.UI.createLabel({
                                        right:10,
                                        width:self.set_a_field_width_in_table_view_row(person_title_title_field.text),
                                        textAlign:'right',
                                        text:person_title,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                person_title_field.add(person_title_content_field);
                                if((person_title === '')||(person_title === null)){
                                        person_title_content_field.visible = false;
                                }else{
                                        person_title_required_text_label.visible = false;
                                }
                                self.data.push(person_title_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_title_field');
                                return;
                        }                                
                }
                /**
                 *  init contact person first name field
                 */
                function _init_contact_person_first_name_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;                                
                                var is_required_field = true;
                                var contact_person_first_name_field = Ti.UI.createTableViewRow({
                                        className:'set_client_contact_first_name',
                                        filter_class:'set_client_contact_first_name',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter first name.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var contact_person_first_name_title_field = Ti.UI.createLabel({
                                        text:'First Name',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                contact_person_first_name_field.add(contact_person_first_name_title_field);

                                var contact_person_company_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(contact_person_first_name_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_contact_first_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                contact_person_first_name_field.add(contact_person_company_content_field);
                                self.data.push(contact_person_first_name_field);
                                contact_person_company_content_field.addEventListener('change',function(e){
                                        _client_contact_first_name = e.value;
                                        _is_make_changed = true;
                                });
                                contact_person_company_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                contact_person_company_content_field.addEventListener('focus',function(e){                                        
                                        _is_first_name_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                contact_person_company_content_field.addEventListener('blur',function(e){
                                        _is_first_name_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_first_name_field');
                                return;
                        }                                
                }
                /**
                 *  init contact person last name field
                 */
                function _init_contact_person_last_name_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;                                  
                                var is_required_field = false;
                                var contact_person_last_name_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_contact_last_name',
                                        className:'set_client_contact_last_name',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter last name.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var contact_person_last_name_title_field = Ti.UI.createLabel({
                                        text:'Last Name',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                contact_person_last_name_field.add(contact_person_last_name_title_field);
                                var contact_person_last_name_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(contact_person_last_name_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_contact_last_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                contact_person_last_name_field.add(contact_person_last_name_content_field);
                                self.data.push(contact_person_last_name_field);
                                contact_person_last_name_content_field.addEventListener('change',function(e){
                                        _client_contact_last_name = e.value;
                                        _is_make_changed = true;
                                });
                                contact_person_last_name_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                contact_person_last_name_content_field.addEventListener('focus',function(e){                                        
                                        _is_last_name_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                contact_person_last_name_content_field.addEventListener('blur',function(e){
                                        _is_last_name_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_last_name_field');
                                return;
                        }                                
                }
                /**
                 *  init conatct person position field
                 */
                function _init_contact_person_position_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;                                  
                                var is_required_field = false;
                                var contact_person_position_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_contact_position',
                                        className:'set_client_contact_position',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter postion.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var contact_person_position_title_field = Ti.UI.createLabel({
                                        text:'Position',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                contact_person_position_field.add(contact_person_position_title_field);
                                var contact_person_position_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(contact_person_position_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_contact_position,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                contact_person_position_field.add(contact_person_position_content_field);
                                self.data.push(contact_person_position_field);
                                contact_person_position_content_field.addEventListener('change',function(e){
                                        _client_contact_position = e.value;
                                        _is_make_changed = true;
                                });
                                contact_person_position_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                contact_person_position_content_field.addEventListener('focus',function(e){                                        
                                        _is_postion_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                contact_person_position_content_field.addEventListener('blur',function(e){
                                        _is_postion_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_position_field');
                                return;
                        }                                
                }
                /**
                 *  init contact person primary phone field
                 */
                function _init_contact_person_primary_phone_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;                                
                                var is_required_field = false;
                                var contact_person_primary_phone_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_contact_primary_contact',
                                        className:'set_client_contact_primary_contact',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter mobile.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var contact_person_primary_phone_title_field = Ti.UI.createLabel({
                                        text:'Mobile',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                contact_person_primary_phone_field.add(contact_person_primary_phone_title_field);
                                var contact_person_primary_phone_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(contact_person_primary_phone_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_contact_phone_mobile,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                contact_person_primary_phone_field.add(contact_person_primary_phone_content_field);
                                self.data.push(contact_person_primary_phone_field);
                                contact_person_primary_phone_content_field.addEventListener('change',function(e){
                                        _client_contact_phone_mobile = e.value;
                                        _is_make_changed = true;
                                });
                                contact_person_primary_phone_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                contact_person_primary_phone_content_field.addEventListener('focus',function(e){                                        
                                        _is_primary_phone_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                contact_person_primary_phone_content_field.addEventListener('blur',function(e){
                                        _is_primary_phone_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                   
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
                                _current_field_num++;
                                var field_num = _current_field_num;                                 
                                var is_required_field = false;
                                var contact_person_secondary_phone_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_contact_secondary_contact',
                                        className:'set_client_contact_secondary_contact',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter phone.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var contact_person_secondary_phone_title_field = Ti.UI.createLabel({
                                        text:'Phone',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                contact_person_secondary_phone_field.add(contact_person_secondary_phone_title_field);
                                var contact_person_secondary_phone_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(contact_person_secondary_phone_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_contact_phone,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                contact_person_secondary_phone_field.add(contact_person_secondary_phone_content_field);
                                self.data.push(contact_person_secondary_phone_field);
                                contact_person_secondary_phone_content_field.addEventListener('change',function(e){
                                        _client_contact_phone = e.value;
                                        _is_make_changed = true;
                                });
                                contact_person_secondary_phone_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                contact_person_secondary_phone_content_field.addEventListener('focus',function(e){                                        
                                        _is_secondary_phone_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                contact_person_secondary_phone_content_field.addEventListener('blur',function(e){
                                        _is_secondary_phone_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                 
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
                                _current_field_num++;
                                var field_num = _current_field_num;                                   
                                var is_required_field = false;
                                var contact_person_fax_field = Ti.UI.createTableViewRow({
                                        className:'set_client_contact_fax',
                                        filter_class:'set_client_contact_fax',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter fax.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var contact_person_fax_title_field = Ti.UI.createLabel({
                                        text:'Fax',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                contact_person_fax_field.add(contact_person_fax_title_field);
                                var contact_person_fax_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(contact_person_fax_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_contact_fax,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                contact_person_fax_field.add(contact_person_fax_content_field);
                                self.data.push(contact_person_fax_field);
                                contact_person_fax_content_field.addEventListener('change',function(e){
                                        _client_contact_fax = e.value;
                                        _is_make_changed = true;
                                });
                                contact_person_fax_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                contact_person_fax_content_field.addEventListener('focus',function(e){                                        
                                        _is_phone_fax_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                contact_person_fax_content_field.addEventListener('blur',function(e){
                                        _is_phone_fax_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                 
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
                                _current_field_num++;
                                var field_num = _current_field_num;                                  
                                var is_required_field = false;
                                var contact_person_email_field = Ti.UI.createTableViewRow({
                                        className:'set_client_contact_email',
                                        filter_class:'set_client_contact_email',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter email.',//for check value
                                        valueCheckExtra:'email',
                                        valueCheckPrompt:'Wrong email format.',
                                        height:self.default_table_view_row_height
                                });
                                var contact_person_email_title_field = Ti.UI.createLabel({
                                        text:'Email',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                contact_person_email_field.add(contact_person_email_title_field);
                                var contact_person_email_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(contact_person_email_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_contact_email,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_EMAIL,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                contact_person_email_field.add(contact_person_email_content_field);
                                self.data.push(contact_person_email_field);
                                contact_person_email_content_field.addEventListener('change',function(e){
                                        _client_contact_email = e.value;
                                        _is_make_changed = true;
                                });
                                contact_person_email_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });  
                                contact_person_email_content_field.addEventListener('focus',function(e){                                        
                                        _is_email_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                contact_person_email_content_field.addEventListener('blur',function(e){
                                        _is_email_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_email_field');
                                return;
                        }                                
                }
                /**
                 *  init contact person website field
                 */
                function _init_contact_person_website_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;                                  
                                var is_required_field = false;
                                var contact_person_website_field = Ti.UI.createTableViewRow({
                                        className:'set_client_contact_website',
                                        filter_class:'set_client_contact_website',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter website.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var contact_person_website_title_field = Ti.UI.createLabel({
                                        text:'Website',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                contact_person_website_field.add(contact_person_website_title_field);
                                var contact_person_website_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(contact_person_website_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_contact_website,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_URL,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                contact_person_website_field.add(contact_person_website_content_field);
                                self.data.push(contact_person_website_field);
                                contact_person_website_content_field.addEventListener('change',function(e){
                                        _client_contact_website = e.value;
                                        _is_make_changed = true;
                                });
                                contact_person_website_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                contact_person_website_content_field.addEventListener('focus',function(e){                                        
                                        _is_website_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                contact_person_website_content_field.addEventListener('blur',function(e){
                                        _is_website_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_website_field');
                                return;
                        }                                
                }
                /**
                 *  init contact person skype field
                 */
                function _init_contact_person_skype_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;                                 
                                var is_required_field = false;
                                var contact_person_skype_field = Ti.UI.createTableViewRow({
                                        className:'set_client_contact_skype',
                                        filter_class:'set_client_contact_skype',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter skype.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var contact_person_skype_title_field = Ti.UI.createLabel({
                                        text:'Skype',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                contact_person_skype_field.add(contact_person_skype_title_field);
                                var contact_person_skype_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(contact_person_skype_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_client_contact_skype_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_URL,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                contact_person_skype_field.add(contact_person_skype_content_field);
                                self.data.push(contact_person_skype_field);
                                contact_person_skype_content_field.addEventListener('change',function(e){
                                        _client_contact_skype_name = e.value;
                                        _is_make_changed = true;
                                });
                                contact_person_skype_content_field.addEventListener('focus',function(e){                                        
                                        _is_skype_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                contact_person_skype_content_field.addEventListener('blur',function(e){
                                        _is_skype_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_skype_field');
                                return;
                        }                                
                }
                /**
                 *  init contact person note field
                 */
                function _init_contact_person_note_field(){
                        try{
                                _current_field_num++;                             
                                var is_required_field = false;
                                var contact_person_note_field = Ti.UI.createTableViewRow({
                                        className:'set_client_contact_note',
                                        filter_class:'set_client_contact_note',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value
                                        valuePrompt:'Please enter note.',//for check value
                                        height:'auto',
                                        hasChild:true
                                });
                                var note_title_field = Ti.UI.createLabel({
                                        text:'Note',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10,
                                        height:30,
                                        top:10
                                });
                                contact_person_note_field.add(note_title_field);

                                var contact_person_note_required_text_label = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(note_title_field.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }                                        
                                });
                                contact_person_note_field.add(contact_person_note_required_text_label);
                               
                                var contact_person_note_content_field = Ti.UI.createLabel({
                                        top:5,
                                        bottom:5,
                                        right:10,
                                        height:'auto',
                                        width:self.set_a_field_width_in_table_view_row(note_title_field.text),
                                        textAlign:'right',
                                        text:_client_contact_note,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                contact_person_note_field.add(contact_person_note_content_field);
                                self.data.push(contact_person_note_field);                                
                                
                                if((_client_contact_note === '')||(_client_contact_note === null)){
                                        contact_person_note_content_field.visible = false;                                
                                }else{
                                        contact_person_note_required_text_label.visible = false;
                                }                              
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contact_person_note_field');
                                return;
                        }                                
                }
                /**
                 *  init delete button
                 */
                function _init_delete_btn(){
                        try{
                                self.deleteButtonField = Ti.UI.createTableViewRow({
                                        className:'set_delete_button',
                                        filter_class:'set_delete_button',
                                        header:'',
                                        valueRequired:false
                                });
                                var deleteButton = Ti.UI.createButton({
                                        title:'Delete',
                                        backgroundImage:self.get_file_path('image','BUTT_red_off.png'),
                                        textAlign:'center',
                                        height:self.default_table_view_row_height,
                                        width:(self.is_ipad())?self.screen_width-self.ipad_button_reduce_length_in_tableview:self.screen_width-self.iphone_button_reduce_length_in_tableview
                                });
                                self.deleteButtonField.add(deleteButton);
                                self.data.push(self.deleteButtonField);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_delete_btn');
                                return;
                        }                                
                }
                /**
                 *  check if some field has been changed
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
                                        var rows = db.execute('SELECT * FROM my_client_contact WHERE id=?',_selected_client_contact_id);
                                        if(_client_contact_first_name != rows.fieldByName('first_name')){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_contact_last_name!= rows.fieldByName('last_name'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_contact_title_id != rows.fieldByName('salutation_code'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_contact_position != rows.fieldByName('position'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_contact_phone_mobile != rows.fieldByName('phone_mobile'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_contact_phone != rows.fieldByName('phone'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_contact_fax != rows.fieldByName('fax'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_contact_skype_name != rows.fieldByName('skype_name'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_contact_email != rows.fieldByName('email'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_contact_website != rows.fieldByName('website'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_client_contact_note != rows.fieldByName('note'))){
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
                 *  trigge this event when click person title row
                 */
                function _event_contact_person_title(e){
                        try{
                                var job_quote_status_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','base/select_unique_code_from_table_view.js'),
                                        win_title:'Select Title',
                                        table_name:'my_salutation_code',//table name
                                        display_name:'name',//need to shwo field
                                        content:e.row.contact_person_title_id,
                                        content_value:e.row.person_title,
                                        source:'edit_client_contact'
                                });
                                Titanium.UI.currentTab.open(job_quote_status_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_contact_person_title');
                                return;
                        }                                
                }
                /**
                 *  trigge this event when click person title row
                 */                
                function _event_contact_person_note(e){
                        try{
                                var note_win = Ti.UI.createWindow({
                                        title:'Edit Note',
                                        url:self.get_file_path('url', 'base/edit_textarea_field.js'),
                                        content:_client_contact_note,
                                        source:'edit_client_contact_note'
                                });
                                Titanium.UI.currentTab.open(note_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_contact_person_note');
                                return;
                        }
                }                
                /**
                 *  delete button event
                 */
                function _event_delete_btn(){
                        try{
                                var optionDialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['YES','NO','']:['YES','NO'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:1,
                                        title:'Do you want to delete this contact?'
                                });
                                optionDialog.show();
                                optionDialog.addEventListener('click',function(e){
                                        if(e.index == 0){
                                                if(_selected_client_contact_id > 1000000000){
                                                        var db = Titanium.Database.open(self.get_db_name());
                                                        db.execute('DELETE FROM my_client_contact WHERE id=?',_selected_client_contact_id);
                                                        db.close();
                                                        if(_parent_source === 'client_contact_view'){
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
                                                                                self.update_selected_tables(null,'ClientContact',JSON.parse(this.responseText));  
                                                                                if(_parent_source === 'client_contact_view'){
                                                                                        _parent_win.close();
                                                                                }
                                                                                win.close();
                                                                        }else{
                                                                                var params = {
                                                                                        message:'Remove client contact failed.',
                                                                                        show_message:true,
                                                                                        message_title:'',
                                                                                        send_error_email:true,
                                                                                        error_message:'',
                                                                                        error_source:window_source+' - _event_delete_btn - xhr.onload - 1',
                                                                                        server_response_message:this.responseText
                                                                                };
                                                                                self.processXYZ(params);                                                                                 
                                                                                return;
                                                                        }
                                                                }catch(e){
                                                                        params = {
                                                                                message:'Remove client contact failed.',
                                                                                show_message:true,
                                                                                message_title:'',
                                                                                send_error_email:true,
                                                                                error_message:e,
                                                                                error_source:window_source+' - _event_delete_btn - xhr.onload - 2',
                                                                                server_response_message:this.responseText
                                                                        };
                                                                        self.processXYZ(params);                                                                            
                                                                        return;
                                                                }

                                                        };
                                                        xhr.onerror = function(e){
                                                                var params = {
                                                                        message:'Remove client contact failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:e,
                                                                        error_source:window_source+' - _event_delete_btn - xhr.onerror',
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
                                                                'type':'remove_client_contact',
                                                                'hash':_selected_user_id,
                                                                'id':_selected_client_contact_id,
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
                                self.process_simple_error_message(err,window_source+' - _event_delete_btn');
                                return;
                        }                                
                }
                /*
                 * save event
                 */
                function _save(e){
                        try{
                                var temp_evt = e;
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
                                                                self.update_selected_tables(null,'ClientContact',JSON.parse(this.responseText)); 
                                                                self.hide_indicator();
                                                                if(temp_evt.index == self.default_main_menu_button_index){//menu menu
                                                                        self.close_all_window_and_return_to_menu(); 
                                                                }else{                                                                
                                                                        win.close();
                                                                }
                                                        }
                                                }else{
                                                        self.hide_indicator();
                                                        var params = {
                                                                message:'Save client contact failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:'',
                                                                error_source:window_source+' - _save - xhr.onload -1',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                          
                                                        return;
                                                }
                                        }catch(e){
                                                self.hide_indicator();
                                                params = {
                                                        message:'Save client contact failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - _save - xhr.onload -2',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);                                                  
                                                return;
                                        }                                                                
                                        
                                };
                                xhr.onerror = function(e){
                                        self.hide_indicator();
                                        var params = {
                                                message:'Save client contact failed.',
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
                                        'type':'save_client_contact',
                                        'hash':_selected_user_id,
                                        'id':_selected_client_contact_id,
                                        'client_id':_selected_client_id,
                                        'company_id':_selected_company_id,
                                        'salutation_code':_client_contact_title_id,
                                        'display_name':self.trim(_client_contact_first_name)+' '+self.trim(_client_contact_last_name),
                                        'first_name':self.trim(_client_contact_first_name),
                                        'last_name':self.trim(_client_contact_last_name),
                                        'position':self.trim(_client_contact_position),
                                        'phone_mobile':self.trim(_client_contact_phone_mobile),
                                        'phone':self.trim(_client_contact_phone),
                                        'fax':self.trim(_client_contact_fax),
                                        'skype_name':self.trim(_client_contact_skype_name),
                                        'email':self.trim(_client_contact_email),
                                        'website':self.trim(_client_contact_website),
                                        'note':_client_contact_note,
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
        }

        win.addEventListener('focus',function(){
                try{
                        if(client_contact_edit_client_contact_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                client_contact_edit_client_contact_page.prototype = new F();
                                client_contact_edit_client_contact_page.prototype.constructor = client_contact_edit_client_contact_page;
                                client_contact_edit_client_contact_page_obj = new client_contact_edit_client_contact_page();
                                client_contact_edit_client_contact_page_obj.init();
                        }else{
                                client_contact_edit_client_contact_page_obj.update_field_value_after_set_properites(); 
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        client_contact_edit_client_contact_page_obj.close_window();
                        client_contact_edit_client_contact_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                
        });
}());