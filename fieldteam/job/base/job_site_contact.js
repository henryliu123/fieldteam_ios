/**
 *  Description: site_contact editor
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var job_base_site_contact_page_obj = null;

        function job_base_site_contact_page(){
                var self = this;
                var window_source = 'job_base_site_contact_page';
                if(win.action_for_site_contact == 'edit_job_site_contact'){
                        win.title = 'Edit Site Contact';
                }else{
                        win.title = 'Add Site Contact';
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
                                self.init_navigation_bar('Done','Main,Back'); 
                                self.init_vars();
                                _init_primary_contact_field();
                                _init_site_contact_person_title_field();
                                _init_site_contact_first_name_field();
                                _init_site_contact_last_name_field();
                                _init_site_contact_mobile_field();
                                _init_site_contact_phone_work_field();
                                _init_site_contact_phone_field();
                                _init_site_contact_email_field();
                                _init_site_contact_note_field();
                                if(_action_for_site_contact == 'edit_job_site_contact'){
                                        _init_delete_btn();
                                }
                                //call int_table_view function of parent class: fieldteam.js
                                self.init_table_view(); 
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_is_first_name_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_last_name_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_primary_phone_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_secondary_phone_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }   
                                        if(_is_phone_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_email_content_field_focused && (_selected_field_object != null)){
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
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_'+_type+'_site_contact WHERE id=?',_selected_job_site_contact_id);
                                if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                        _site_contact_title_id = rows.fieldByName('salutation_code');
                                        _site_contact_first_name = rows.fieldByName('first_name');
                                        _site_contact_last_name = rows.fieldByName('last_name');
                                        _site_contact_mobile = rows.fieldByName('phone_mobile');
                                        _site_contact_phone = rows.fieldByName('phone');
                                        _site_contact_phone_work = rows.fieldByName('phone_work');
                                        _site_contact_email = rows.fieldByName('email');
                                        _site_contact_note = rows.fieldByName('note');
                                        _is_primary_contact = rows.fieldByName('is_primary_contact');
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
                                if(_check_if_exist_change()){
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
                                        //            if((self.trim(_site_contact_mobile) === '') && (self.trim(_site_contact_phone) === '')){
                                        //                error_string += 'Please enter mobile or phone.'+'\n';
                                        //            }
                                        if(error_string != ''){
                                                self.show_message(error_string);
                                                return;
                                        }


                                        var db = Titanium.Database.open(self.get_db_name());
                                        var d = new Date();
                                        if(_is_primary_contact){//set other primary contact is false
                                                var rows = db.execute('SELECT * FROM my_'+_type+'_site_contact WHERE '+_type+'_id=? and is_primary_contact=1',_selected_job_id);
                                                if(rows.getRowCount() > 0){
                                                        while(rows.isValidRow()){
                                                                db.execute('UPDATE my_'+_type+'_site_contact SET is_primary_contact=?,changed=? '+
                                                                        ' WHERE id='+rows.fieldByName('id'),
                                                                        0,
                                                                        1);
                                                                rows.next();
                                                        }
                                                }
                                                rows.close();
                                        }
                                        if(_selected_job_site_contact_id > 0){//update
                                                db.execute('UPDATE my_'+_type+'_site_contact SET '+_type+'_id=?,salutation_code=?,display_name=?,first_name=?,last_name=?,phone_mobile=?,phone=?,phone_work=?,email=?,note=?,is_primary_contact=?,changed=? '+
                                                        ' WHERE id='+_selected_job_site_contact_id,
                                                        _selected_job_id,
                                                        _site_contact_title_id,
                                                        _site_contact_first_name+' '+_site_contact_last_name,
                                                        _site_contact_first_name,
                                                        _site_contact_last_name,
                                                        _site_contact_mobile,
                                                        _site_contact_phone,
                                                        _site_contact_phone_work,
                                                        _site_contact_email,
                                                        _site_contact_note,
                                                        _is_primary_contact,
                                                        1);
                                        }else{//add
                                                var new_time_value = parseInt(d.getTime(), 10);
                                                db.execute('INSERT INTO my_'+_type+'_site_contact (id,local_id,'+_type+'_id,salutation_code,display_name,first_name,last_name,phone_mobile,phone,phone_work,email,'+
                                                        'note,is_primary_contact,status_code,changed)'+
                                                        'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                                        new_time_value,
                                                        _selected_company_id+'-'+_selected_user_id+'-'+new_time_value,
                                                        _selected_job_id,
                                                        _site_contact_title_id,
                                                        _site_contact_first_name+' '+_site_contact_last_name,
                                                        _site_contact_first_name,
                                                        _site_contact_last_name,
                                                        _site_contact_mobile,
                                                        _site_contact_phone,
                                                        _site_contact_phone_work,
                                                        _site_contact_email,
                                                        _site_contact_note,
                                                        _is_primary_contact,
                                                        1,
                                                        1);
                                        }
                                        db.close();
                                }
                                if(e.index == self.default_main_menu_button_index){//menu menu
                                        self.close_all_window_and_return_to_menu(); 
                                }else{                                                                
                                        win.close();
                                }
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
                                                                        win.close();
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
                                                win.close();
                                        }
                                }
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
                                        case 'set_site_contact_title':
                                                _event_for_contact_person_title(e);
                                                break;
                                        case 'set_delete_button':
                                                _event_for_delete_btn();
                                                break;
                                        case 'set_site_contact_first_name':
                                        case 'set_site_contact_last_name':
                                        case 'set_site_contact_mobile':
                                        case 'set_site_contact_phone':
                                        case 'set_site_contact_phone_work':
                                        case 'set_site_contact_email':
//                                                if((self.table_view.data[1] != undefined) && (self.table_view.data[1] != null)){
//                                                        if((self.table_view.data[1].rows[index-1].children[1] != undefined) && (self.table_view.data[1].rows[index-1].children[1] != null)){
//                                                                self.table_view.data[1].rows[index-1].children[1].focus();
//                                                        }
//                                                }
                                                break;
                                        case 'set_site_contact_note':
                                                _display_note_edit_page(e);   
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
                                if(Ti.App.Properties.getBool('update_unique_code_client_contact_list_view_flag')){
                                        _site_contact_title_id = Ti.App.Properties.getString('update_unique_code_client_contact_list_view_id');
                                        if(_current_selected_row != null){
                                                _current_selected_row.site_contact_title_id = _site_contact_title_id;
                                                _current_selected_row.person_title = Ti.App.Properties.getString('update_unique_code_client_contact_list_view_content');
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _current_selected_row.person_title;
                                                if((_current_selected_row.person_title === '')||(_current_selected_row.person_title === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                
                                                _is_make_changed = true;
                                        }
                                        Ti.App.Properties.setBool('update_unique_code_client_contact_list_view_flag',false);
                                }        
                                if(Ti.App.Properties.getBool('update_edit_textarea_field_job_site_contact_note_view_flag')){                                         
                                        _site_contact_note = Ti.App.Properties.getString('update_edit_textarea_field_job_site_contact_note_view_content');
                                        if(_current_selected_row != null){
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _site_contact_note;
                                                if((_site_contact_note === '')||( _site_contact_note === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_edit_textarea_field_job_site_contact_note_view_flag',false);
                                }                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.update_field_value_after_set_properites');
                                return;
                        }
                };                         
                
                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _action_for_site_contact = win.action_for_site_contact;
                var _type = win.type;
                var _selected_job_id = win.job_id;//Ti.App.Properties.getString('currentSelectedJobID');
                var _selected_job_site_contact_id = win.job_site_contact_id;
                var _site_contact_title_id= 0;
                var _site_contact_first_name = '';
                var _site_contact_last_name = '';
                var _site_contact_mobile = '';
                var _site_contact_phone = '';
                var _site_contact_phone_work = '';
                var _site_contact_email = '';
                var _site_contact_note = '';
                var _is_primary_contact = 0;
                var _current_field_num=0;
                var _current_selected_row = null;
                var _is_make_changed = false;
                var _selected_field_object = null;
                var _is_first_name_content_field_focused = false;
                var _is_last_name_content_field_focused = false;
                var _is_primary_phone_content_field_focused = false;
                var _is_secondary_phone_content_field_focused = false;
                var _is_phone_content_field_focused = false;
                var _is_email_content_field_focused = false;              
                //private method

                /**
                 *  init primary contact field
                 */
                function _init_primary_contact_field(){
                        try{
                                _current_field_num++;
                                var primary_contact_field = Ti.UI.createTableViewRow({
                                        is_primary_contact:_is_primary_contact,
                                        className:'set_site_primary_contact',
                                        filter_class:'set_site_primary_contact',
                                        height:self.default_table_view_row_height
                                });
                                var primary_contact_title_field = Ti.UI.createLabel({
                                        text:'Primary Contact',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                primary_contact_field.add(primary_contact_title_field);

                                var primary_contact_switch = Titanium.UI.createSwitch({
                                        value:_is_primary_contact,
                                        right:10,
                                        height:'auto'
                                });
                                primary_contact_field.add(primary_contact_switch);
                                primary_contact_switch.addEventListener('change',function(e){
                                        _is_primary_contact = e.value;
                                        _is_make_changed = true;
                                });
                                self.data.push(primary_contact_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_primary_contact_field');
                                return;
                        }                                     
                }
                /**
                 *  init site contact person title field
                 */
                function _init_site_contact_person_title_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = false;
                                var person_title = '';
                                if(_action_for_site_contact == 'edit_job_site_contact'){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_salutation_code WHERE code=? and code>0',_site_contact_title_id);
                                        if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                person_title = (rows.fieldByName('name') == '')?'':rows.fieldByName('name');
                                        }
                                        rows.close();
                                        db.close();
                                }
                                var person_title_field = Ti.UI.createTableViewRow({
                                        site_contact_title_id:_site_contact_title_id,
                                        person_title:person_title,
                                        className:'set_site_contact_title',
                                        filter_class:'set_site_contact_title',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value,
                                        valuePrompt:'Please select title.',//for check value
                                        hasChild:true,
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
                                self.process_simple_error_message(err,window_source+' - _init_site_contact_person_title_field');
                                return;
                        }                                     
                }
                /**
                 *  init site contact first name field
                 */
                function _init_site_contact_first_name_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;  
                                var is_required_field = true;                                
                                var site_contact_first_name_Field = Ti.UI.createTableViewRow({
                                        className:'set_site_contact_first_name',
                                        filter_class:'set_site_contact_first_name',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter first name.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var site_contact_first_name_title_Field = Ti.UI.createLabel({
                                        text:'First Name',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                site_contact_first_name_Field.add(site_contact_first_name_title_Field);

                                var site_contact_first_name_content_Field = Ti.UI.createTextField({
                                        right:30,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(site_contact_first_name_title_Field.text),
                                        textAlign:'right',
                                        value:_site_contact_first_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                site_contact_first_name_Field.add(site_contact_first_name_content_Field);
                                self.data.push(site_contact_first_name_Field);
                                site_contact_first_name_content_Field.addEventListener('change',function(e){
                                        _site_contact_first_name = e.value;
                                        _is_make_changed = true;
                                });
                                site_contact_first_name_content_Field.addEventListener('return',function(e){
                                        if((self.table_view.data[0].rows[field_num].children[1] != undefined) && (self.table_view.data[0].rows[field_num].children[1] != null)){
                                                self.table_view.data[0].rows[field_num].children[1].focus();
                                        }
                                });
                                site_contact_first_name_content_Field.addEventListener('focus',function(e){                                        
                                        _is_first_name_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                site_contact_first_name_content_Field.addEventListener('blur',function(e){
                                        _is_first_name_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_site_contact_first_name_field');
                                return;
                        }                                     
                }
                /**
                 *  init site contact last name field
                 */
                function _init_site_contact_last_name_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;  
                                var is_required_field = false;                                   
                                var site_contact_last_name_Field = Ti.UI.createTableViewRow({
                                        className:'set_site_contact_last_name',
                                        filter_class:'set_site_contact_last_name',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter last name.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var site_contact_last_name_title_Field = Ti.UI.createLabel({
                                        text:'Last Name',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                site_contact_last_name_Field.add(site_contact_last_name_title_Field);

                                var site_contact_last_name_content_Field = Ti.UI.createTextField({
                                        right:30,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(site_contact_last_name_title_Field.text),
                                        textAlign:'right',
                                        value:_site_contact_last_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                site_contact_last_name_Field.add(site_contact_last_name_content_Field);
                                self.data.push(site_contact_last_name_Field);
                                site_contact_last_name_content_Field.addEventListener('change',function(e){
                                        _site_contact_last_name = e.value;
                                        _is_make_changed = true;
                                });
                                site_contact_last_name_content_Field.addEventListener('return',function(e){
                                        if((self.table_view.data[0].rows[field_num].children[1] != undefined) && (self.table_view.data[0].rows[field_num].children[1] != null)){
                                                self.table_view.data[0].rows[field_num].children[1].focus();
                                        }
                                });
                                site_contact_last_name_content_Field.addEventListener('focus',function(e){                                        
                                        _is_last_name_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                site_contact_last_name_content_Field.addEventListener('blur',function(e){
                                        _is_last_name_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_site_contact_last_name_field');
                                return;
                        }                                     
                }
                /**
                 *  init site contact mobile field
                 */
                function _init_site_contact_mobile_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;  
                                var is_required_field = false;                                       
                                var site_contact_mobile_Field = Ti.UI.createTableViewRow({
                                        className:'set_site_contact_mobile',
                                        filter_class:'set_site_contact_mobile',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter mobile.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var site_contact_mobile_title_Field = Ti.UI.createLabel({
                                        text:'Mobile',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                site_contact_mobile_Field.add(site_contact_mobile_title_Field);

                                var site_contact_mobile_content_Field = Ti.UI.createTextField({
                                        right:30,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(site_contact_mobile_title_Field.text),
                                        textAlign:'right',
                                        value:_site_contact_mobile,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_PHONE_PAD,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                site_contact_mobile_Field.add(site_contact_mobile_content_Field);
                                self.data.push(site_contact_mobile_Field);
                                site_contact_mobile_content_Field.addEventListener('change',function(e){
                                        _site_contact_mobile = e.value;
                                        _is_make_changed = true;
                                });
                                site_contact_mobile_content_Field.addEventListener('return',function(e){
                                        if((self.table_view.data[0].rows[field_num].children[1] != undefined) && (self.table_view.data[0].rows[field_num].children[1] != null)){
                                                self.table_view.data[0].rows[field_num].children[1].focus();
                                        }
                                });
                                site_contact_mobile_content_Field.addEventListener('focus',function(e){                                        
                                        _is_primary_phone_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                site_contact_mobile_content_Field.addEventListener('blur',function(e){
                                        _is_primary_phone_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_site_contact_mobile_field');
                                return;
                        }                                     
                }
                /**
                 *  init site contact phone work field
                 */
                function _init_site_contact_phone_work_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;  
                                var is_required_field = false;                                    
                                var site_contact_phone_work_Field = Ti.UI.createTableViewRow({
                                        className:'set_site_contact_phone_work',
                                        filter_class:'set_site_contact_phone_work',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter work phone.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var site_contact_phone_work_title_Field = Ti.UI.createLabel({
                                        text:'Work Phone',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                site_contact_phone_work_Field.add(site_contact_phone_work_title_Field);

                                var site_contact_phone_work_content_Field = Ti.UI.createTextField({
                                        right:30,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(site_contact_phone_work_title_Field.text),
                                        textAlign:'right',
                                        value:_site_contact_phone_work,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_PHONE_PAD,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                site_contact_phone_work_Field.add(site_contact_phone_work_content_Field);
                                self.data.push(site_contact_phone_work_Field);
                                site_contact_phone_work_content_Field.addEventListener('change',function(e){
                                        _site_contact_phone_work = e.value;
                                        _is_make_changed = true;
                                });
                                site_contact_phone_work_content_Field.addEventListener('return',function(e){
                                        if((self.table_view.data[0].rows[field_num].children[1] != undefined) && (self.table_view.data[0].rows[field_num].children[1] != null)){
                                                self.table_view.data[0].rows[field_num].children[1].focus();
                                        }
                                });
                                site_contact_phone_work_content_Field.addEventListener('focus',function(e){                                        
                                        _is_secondary_phone_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                site_contact_phone_work_content_Field.addEventListener('blur',function(e){
                                        _is_secondary_phone_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_site_contact_phone_work_field');
                                return;
                        }                                     
                }
                /**
                 *  init site contact phone field
                 */
                function _init_site_contact_phone_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;  
                                var is_required_field = false;                                  
                                var site_contact_phone_Field = Ti.UI.createTableViewRow({
                                        className:'set_site_contact_phone',
                                        filter_class:'set_site_contact_phone',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter phone.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var site_contact_phone_title_Field = Ti.UI.createLabel({
                                        text:'Phone',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                site_contact_phone_Field.add(site_contact_phone_title_Field);

                                var site_contact_phone_content_Field = Ti.UI.createTextField({
                                        right:30,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(site_contact_phone_title_Field.text),
                                        textAlign:'right',
                                        value:_site_contact_phone,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_PHONE_PAD,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                site_contact_phone_Field.add(site_contact_phone_content_Field);
                                self.data.push(site_contact_phone_Field);
                                site_contact_phone_content_Field.addEventListener('change',function(e){
                                        _site_contact_phone = e.value;
                                        _is_make_changed = true;
                                });
                                site_contact_phone_content_Field.addEventListener('return',function(e){
                                        if((self.table_view.data[0].rows[field_num].children[1] != undefined) && (self.table_view.data[0].rows[field_num].children[1] != null)){
                                                self.table_view.data[0].rows[field_num].children[1].focus();
                                        }
                                });
                                site_contact_phone_content_Field.addEventListener('focus',function(e){                                        
                                        _is_phone_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                site_contact_phone_content_Field.addEventListener('blur',function(e){
                                        _is_phone_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_site_contact_phone_field');
                                return;
                        }                                     
                }
                /**
                 *  init site contact email field
                 */
                function _init_site_contact_email_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;  
                                var is_required_field = false;                                  
                                var site_contact_email_Field = Ti.UI.createTableViewRow({
                                        className:'set_site_contact_email',
                                        filter_class:'set_site_contact_email',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter email.',//for check value
                                        valueCheckExtra:'email',
                                        valueCheckPrompt:'Wrong email format.',
                                        height:self.default_table_view_row_height
                                });
                                var site_contact_email_title_Field = Ti.UI.createLabel({
                                        text:'Email',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                site_contact_email_Field.add(site_contact_email_title_Field);

                                var site_contact_email_content_Field = Ti.UI.createTextField({
                                        right:30,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(site_contact_email_title_Field.text),
                                        textAlign:'right',
                                        value:_site_contact_email,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_EMAIL,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                site_contact_email_Field.add(site_contact_email_content_Field);
                                self.data.push(site_contact_email_Field);
                                site_contact_email_content_Field.addEventListener('change',function(e){
                                        _site_contact_email = e.value;
                                        _is_make_changed = true;
                                });
                                site_contact_email_content_Field.addEventListener('return',function(e){
                                        if((self.table_view.data[0].rows[field_num].children[1] != undefined) && (self.table_view.data[0].rows[field_num].children[1] != null)){
                                                self.table_view.data[0].rows[field_num].children[1].fireEvent('click');
                                        }
                                });
                                site_contact_email_content_Field.addEventListener('focus',function(e){                                        
                                        _is_email_content_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                site_contact_email_content_Field.addEventListener('blur',function(e){
                                        _is_email_content_field_focused = false;
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_site_contact_email_field');
                                return;
                        }                                     
                }
                /**
                 *  init site contact note field
                 */
                function _init_site_contact_note_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = false;                                   
                                var note_field = Ti.UI.createTableViewRow({
                                        className:'set_site_contact_note',
                                        filter_class:'set_site_contact_note',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter note.',//for check value
                                        height:'auto',
                                        hasChild:true
                                });
                                var note_title_field = Ti.UI.createLabel({
                                        text:'Note',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                note_field.add(note_title_field);
                                
                                var note_required_text_label = Ti.UI.createLabel({
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
                                note_field.add(note_required_text_label);                                

                                var note_content_field = Ti.UI.createLabel({
                                        right:10,
                                        height:'auto',
                                        width:self.set_a_field_width_in_table_view_row(note_title_field.text),
                                        textAlign:'right',
                                        text:_site_contact_note,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                note_field.add(note_content_field);
                                self.data.push(note_field);
                                
                                if((self.trim(_site_contact_note) === '')||(_site_contact_note === null)){
                                        note_content_field.visible =false;                                
                                }else{
                                        note_required_text_label.visible = false;
                                }                                                                                                                            
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_site_contact_note_field');
                                return;
                        }                                     
                }
                /**
                 *  init delete button 
                 */
                function _init_delete_btn(){
                        try{
                                var delete_button_field = Ti.UI.createTableViewRow({
                                        className:'set_delete_button',
                                        filter_class:'set_delete_button',
                                        header:''
                                });
                                var delete_button = Ti.UI.createButton({
                                        title:'Delete',
                                        backgroundImage:self.get_file_path('image','BUTT_red_off.png'),
                                        textAlign:'center',
                                        height:self.default_table_view_row_height,
                                        width:(self.is_ipad())?self.screen_width-self.ipad_button_reduce_length_in_tableview:self.screen_width-self.iphone_button_reduce_length_in_tableview
                                });
                                delete_button_field.add(delete_button);
                                self.data.push(delete_button_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_delete_btn');
                                return;
                        }                                     
                }
                /**
                 *  event for select contact person'title
                 */
                function _event_for_contact_person_title(e){
                        try{
                                var job_quote_status_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','base/select_unique_code_from_table_view.js'),
                                        win_title:'Select Title',
                                        table_name:'my_salutation_code',//table name
                                        display_name:'name',//need to shwo field
                                        content:e.row.site_contact_title_id,
                                        content_value:e.row.person_title,
                                        source:'client_contact_list'
                                });
                                Titanium.UI.currentTab.open(job_quote_status_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_contact_person_title');
                                return;
                        }                                     
                }
                /**
                 *  delete button click event
                 */
                function _event_for_delete_btn(){
                        try{
                                var optionDialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['YES','NO','']:['YES','NO'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:1,
                                        title:L('message_delete_site_contact_in_job_site_contact')
                                });
                                optionDialog.show();
                                optionDialog.addEventListener('click',function(e){
                                        if(e.index === 0){
                                                var db = Titanium.Database.open(self.get_db_name());
                                                if(_selected_job_site_contact_id > 1000000000){
                                                        db.execute('DELETE FROM my_'+_type+'_site_contact WHERE id=?',_selected_job_site_contact_id);
                                                }else{
                                                        db.execute('UPDATE my_'+_type+'_site_contact SET changed=?,status_code=?  WHERE id='+_selected_job_site_contact_id,
                                                                1,2
                                                                );
                                                }
                                                db.close();
                                                if(win.parent_win){
                                                        win.parent_win.close();                                                        
                                                }
                                                win.close();
                                        }
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_delete_btn');
                                return;
                        }                                     
                }
                /**
                 * display note edit page
                 */
                function _display_note_edit_page(e){
                        try{
                                var address_win = Ti.UI.createWindow({
                                        title:'Edit Note',
                                        url:self.get_file_path('url', 'base/edit_textarea_field.js'),
                                        content:_site_contact_note,
                                        source:'job_site_contact_note'
                                });
                                Titanium.UI.currentTab.open(address_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_note_edit_page');
                                return; 
                        }                                   
                }          
                /**
                 *  check if exist any change
                 */
                function _check_if_exist_change(){
                        try{
                                var is_make_changed = false;
                                if(_is_make_changed){
                                        is_make_changed = true;
                                }else{                                      
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_'+_type+'_site_contact WHERE id=?',_selected_job_site_contact_id);
                                        if(_site_contact_title_id != rows.fieldByName('salutation_code')){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_site_contact_first_name != rows.fieldByName('first_name'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_site_contact_last_name != rows.fieldByName('last_name'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_site_contact_mobile != rows.fieldByName('phone_mobile'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_site_contact_phone != rows.fieldByName('phone'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_site_contact_phone_work != rows.fieldByName('phone_work'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_site_contact_email != rows.fieldByName('email'))){
                                                is_make_changed = true;
                                        }
                                        if((!is_make_changed)&&(_site_contact_note != rows.fieldByName('note'))){
                                                is_make_changed = true;
                                        }   
                                        if((!is_make_changed)&&(_is_primary_contact != rows.fieldByName('is_primary_contact'))){
                                                is_make_changed = true;
                                        }                                            
                                        rows.close();
                                        db.close(); 
                                }
                                return is_make_changed;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_exist_change');
                                return false; 
                        }   
                }                 
        }

        win.addEventListener('focus',function(){
                try{
                        if(job_base_site_contact_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_site_contact_page.prototype = new F();
                                job_base_site_contact_page.prototype.constructor = job_base_site_contact_page;
                                job_base_site_contact_page_obj = new job_base_site_contact_page();
                                job_base_site_contact_page_obj.init();
                        }else{
                                job_base_site_contact_page_obj.update_field_value_after_set_properites(); 
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_base_site_contact_page_obj.close_window();
                        job_base_site_contact_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());