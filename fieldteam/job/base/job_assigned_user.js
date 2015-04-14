/**
 *  Description: job assigned user, user can select primary, assistant ....
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_base_assigned_user_page_obj = null;

        function job_base_assigned_user_page(){
                var self = this;
                var window_source = 'job_base_assigned_user_page';
                if(win.action_for_assigned_user == 'edit_job_assigned_user'){
                        win.title = 'Edit Assigned User';
                }else{
                        win.title = 'Add Assigned User';
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
                                _init_assigned_user_code_field();
                                _init_user_field();
                                _init_assigned_from_field();
                                _init_assigned_to_field();
                                if(_action_for_assigned_user === 'edit_job_assigned_user'){
                                        _init_delete_btn();
                                }
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return; 
                        }                                
                };
                /**
                 *  override table_view_click_event function of parent class: fieldteam.js
                 */                 
                self.table_view_click_event = function(e){
                        try{
                                _current_selected_row = e.row;
                                switch(e.row.filter_class){
                                        case 'set_job_assigned_user_code':
                                                _event_for_assigned_user_code(e);
                                                break;
                                        case 'set_job_assigned_user':
                                                _event_for_assigned_user(e);
                                                break;
                                        case 'set_job_assigned_from':
                                                _event_for_assigned_from(e);
                                                break;
                                        case 'set_job_assigned_to':
                                                _event_for_assigned_to(e);
                                                break;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return; 
                        }                          
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                 
                self.nav_right_btn_click_event = function(e){
                        try{
                                
                                var error_string = '';
                                if(_assigned_user_code_name == ''){
                                        error_string += 'Please select type.\n';
                                }
                                if(_assigned_user_name == ''){
                                        error_string += 'Please select assigned user.\n';
                                }
                                if((_selected_assigned_to != null)&&(_selected_assigned_from === null)){
                                        error_string += 'Please select from.\n';
                                }else{
                                        if((self.get_seconds_value_by_time_string(_selected_assigned_from) > self.get_seconds_value_by_time_string(_selected_assigned_to))&&(self.get_seconds_value_by_time_string(_selected_assigned_to) > 0)){
                                                error_string = 'Assigned To can\'t less than Assigned From.\n';
                                        }
                                }
                                if(error_string != ''){
                                        self.show_message(error_string);
                                        return; 
                                }
                                if(_check_if_exist_change()){
                                        var db = Titanium.Database.open(self.get_db_name());                                       
                                        if(_selected_job_assigned_user_id > 0){//update
                                                db.execute('UPDATE my_'+_type+'_assigned_user SET manager_user_id=?,job_assigned_user_code=?,assigned_from=?,assigned_to=?,changed=? '+
                                                        ' WHERE id='+_selected_job_assigned_user_id,
                                                        _selected_manager_user_id,
                                                        _selected_job_assigned_user_code,
                                                        _selected_assigned_from,
                                                        _selected_assigned_to,
                                                        1);            
                                        }else{//add
                                                var d = new Date();
                                                var new_time_value = parseInt(d.getTime(), 10);
                                                db.execute('INSERT INTO my_'+_type+'_assigned_user (id,local_id,'+_type+'_id,manager_user_id,'+
                                                        'job_assigned_user_code,assigned_from,assigned_to,status_code,changed)'+
                                                        'VALUES(?,?,?,?,?,?,?,?,?)',
                                                        new_time_value,
                                                        _selected_company_id+'-'+_selected_user_id+'-'+new_time_value,
                                                        _selected_job_id,
                                                        _selected_manager_user_id,
                                                        _selected_job_assigned_user_code,
                                                        _selected_assigned_from,
                                                        _selected_assigned_to,
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
                 *  update field value after set properties 
                 *  in focus event call it
                 */
                self.update_field_value_after_set_properites = function(){
                        try{                                                                
                                if(Ti.App.Properties.getBool('update_unique_code_job_assigned_user_code_view_flag')){
                                        _selected_job_assigned_user_code = Ti.App.Properties.getString('update_unique_code_job_assigned_user_code_view_id');
                                        _assigned_user_code_name = Ti.App.Properties.getString('update_unique_code_job_assigned_user_code_view_content');
                                        if(_current_selected_row != null){
                                                _current_selected_row.job_assigned_user_code = _selected_job_assigned_user_code;
                                                _current_selected_row.job_assigned_user_code_name = _assigned_user_code_name;                                           
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _assigned_user_code_name;
                                                if((_assigned_user_code_name === '')||(_assigned_user_code_name === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_unique_code_job_assigned_user_code_view_flag',false);
                                }
                                if(Ti.App.Properties.getBool('update_unique_code_with_search_job_assigned_user_view_flag')){
                                        _selected_manager_user_id = Ti.App.Properties.getString('update_unique_code_with_search_job_assigned_user_view_id');
                                        _assigned_user_name = Ti.App.Properties.getString('update_unique_code_with_search_job_assigned_user_view_content');
                                        if(_current_selected_row != null){                                                
                                                _current_selected_row.manager_user_id = _selected_manager_user_id;
                                                _current_selected_row.job_assigned_user_name = _assigned_user_name;
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _assigned_user_name;
                                                if((_assigned_user_name === '')||(_assigned_user_name === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_unique_code_with_search_job_assigned_user_view_flag',false);
                                }                                      
                                if(Ti.App.Properties.getBool('update_job_date_and_time_job_assigned_user_scheduled_from_view_flag')){
                                        _selected_assigned_from = Ti.App.Properties.getString('update_job_date_and_time_job_assigned_user_scheduled_from_view_content');
                                        if(_current_selected_row != null){
                                                if(_selected_assigned_from=== null){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].text = 'N/A';
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].text = self.display_time_and_date(self.get_seconds_value_by_time_string(_selected_assigned_from));
                                                }
                                                _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                _current_selected_row.children[_current_selected_row.children.length-2].visible = false;                                                        
                                        }        
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_job_date_and_time_job_assigned_user_scheduled_from_view_flag',false);
                                }  
                                if(Ti.App.Properties.getBool('update_job_date_and_time_job_assigned_user_scheduled_to_view_flag')){
                                        _selected_assigned_to = Ti.App.Properties.getString('update_job_date_and_time_job_assigned_user_scheduled_to_view_content');
                                        if(_current_selected_row != null){
                                                if(_selected_assigned_to=== null){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].text = 'N/A';
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].text = self.display_time_and_date(self.get_seconds_value_by_time_string(_selected_assigned_to));
                                                }
                                                _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                _current_selected_row.children[_current_selected_row.children.length-2].visible = false;                                                        
                                        }      
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_job_date_and_time_job_assigned_user_scheduled_to_view_flag',false);
                                }  
                          
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.update_field_value_after_set_properites');
                                return;
                        }
                };                  

                //private member
                var _type = win.type;
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_job_id = win.job_id;//Ti.App.Properties.getString('currentSelectedJobID');
                var _selected_job_assigned_user_id = win.job_assigned_user_id;
                var _selected_manager_user_id = win.manager_user_id;
                var _selected_assigned_from = win.assigned_from;
                var _selected_assigned_to = win.assigned_to;
                var _selected_job_assigned_user_code = win.job_assigned_user_code;
                var _action_for_assigned_user = win.action_for_assigned_user;
                var _assigned_user_code_name = '';
                var _assigned_user_name = '';
                var _current_selected_row = null;
                var _is_make_changed = false;
                //private method
                /**
                 *  init assigned user code field
                 */
                function _init_assigned_user_code_field(){
                        try{
                                var is_required_field = true;
                                if(_selected_job_assigned_user_code > 0){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_job_assigned_user_code WHERE code=?',_selected_job_assigned_user_code);
                                        if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                _assigned_user_code_name = rows.fieldByName('name');
                                        }else{
                                                _assigned_user_code_name = '';
                                        }
                                        rows.close();
                                        db.close();
                                }
                                var assignedUserCodeField = Ti.UI.createTableViewRow({
                                        className:'set_job_assigned_user_code',
                                        filter_class:'set_job_assigned_user_code',
                                        job_assigned_user_code:_selected_job_assigned_user_code,
                                        job_assigned_user_code_name:_assigned_user_name,
                                        hasChild:true,
                                        height:self.default_table_view_row_height
                                });
                                var assignedUserCodeTitleField = Ti.UI.createLabel({
                                        text:'Type',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                assignedUserCodeField.add(assignedUserCodeTitleField);

                                var jobAssignedUserCodeContentRequiredTextLabel = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(assignedUserCodeTitleField.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                assignedUserCodeField.add(jobAssignedUserCodeContentRequiredTextLabel);

                                var jobAssignedUserCodeContentField = Ti.UI.createLabel({
                                        right:10,
                                        width:self.set_a_field_width_in_table_view_row(assignedUserCodeTitleField.text),
                                        textAlign:'right',
                                        text:_assigned_user_code_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                assignedUserCodeField.add(jobAssignedUserCodeContentField);
                                if((_assigned_user_code_name === '')||(_assigned_user_code_name === null)){
                                        jobAssignedUserCodeContentField.visible = false;
                                }else{
                                        jobAssignedUserCodeContentRequiredTextLabel.visible = false;
                                }
                                self.data.push(assignedUserCodeField);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_assigned_user_code_field');
                                return; 
                        }                                  
                }
                /**
                 *  init manager user field
                 */                
                function _init_user_field(){
                        try{
                                var is_required_field = true; 
                                if(_selected_manager_user_id > 0){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_manager_user WHERE id=?',_selected_manager_user_id);
                                        if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                _assigned_user_name = rows.fieldByName('display_name');
                                        }else{
                                                _assigned_user_name = '';
                                        }
                                        rows.close();
                                        db.close();
                                }
                                var assigned_user_Field = Ti.UI.createTableViewRow({
                                        className:'set_job_assigned_user',
                                        filter_class:'set_job_assigned_user',
                                        manager_user_id:_selected_manager_user_id,
                                        job_assigned_user_name:_assigned_user_name,
                                        hasChild:true,
                                        height:self.default_table_view_row_height
                                });
                                var assigneUserTitleField = Ti.UI.createLabel({
                                        text:'Assigned User',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                assigned_user_Field.add(assigneUserTitleField);

                                var assignUserNameContentRequiredTextLabel = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(assigneUserTitleField.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                assigned_user_Field.add(assignUserNameContentRequiredTextLabel);

                                var assignUserNameContentField = Ti.UI.createLabel({
                                        right:10,
                                        width:self.set_a_field_width_in_table_view_row(assigneUserTitleField.text),
                                        textAlign:'right',
                                        text:_assigned_user_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                assigned_user_Field.add(assignUserNameContentField);
                                if((_assigned_user_name === '')||(_assigned_user_name === null)){
                                        assignUserNameContentField.visible = false;
                                }else{
                                        assignUserNameContentRequiredTextLabel.visible = false;
                                }
                                self.data.push(assigned_user_Field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_user_field');
                                return; 
                        }                                  
                }
                /**
                 *  init assigned from field
                 */                
                function _init_assigned_from_field(){
                        try{
                                var is_required_field = false; 
                                var assigned_from_Field = Ti.UI.createTableViewRow({
                                        className:'set_job_assigned_from',
                                        filter_class:'set_job_assigned_from',
                                        assigned_from:_selected_assigned_from,
                                        hasChild:true,
                                        height:self.default_table_view_row_height
                                });
                                var assigneFromTitleField = Ti.UI.createLabel({
                                        text:'From',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                assigned_from_Field.add(assigneFromTitleField);

                                var assignFromContentRequiredTextLabel = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(assigneFromTitleField.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                assigned_from_Field.add(assignFromContentRequiredTextLabel);

                                var assignFromContentField = Ti.UI.createLabel({
                                        right:10,
                                        width:self.set_a_field_width_in_table_view_row(assigneFromTitleField.text),
                                        textAlign:'right',
                                        text:((_selected_assigned_from === undefined)||(_selected_assigned_from === null) || (_selected_assigned_from === ''))?'N/A':self.display_time_and_date(self.get_seconds_value_by_time_string(_selected_assigned_from)),
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                assigned_from_Field.add(assignFromContentField);
                                if((_selected_assigned_from === undefined)||(_selected_assigned_from === null)||(_selected_assigned_from === '')){
                                        assignFromContentField.visible = false;
                                }else{
                                        assignFromContentRequiredTextLabel.visible = false;
                                }
                                self.data.push(assigned_from_Field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_assigned_from_field');
                                return; 
                        }                                  
                }
                /**
                 *  init assigned to field
                 */                
                function _init_assigned_to_field(){
                        try{
                                var is_required_field = false; 
                                var assigned_to_Field = Ti.UI.createTableViewRow({
                                        className:'set_job_assigned_to',
                                        filter_class:'set_job_assigned_to',
                                        assigned_from:_selected_assigned_to,
                                        hasChild:true,
                                        height:self.default_table_view_row_height
                                });
                                var assigneToTitleField = Ti.UI.createLabel({
                                        text:'To',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                assigned_to_Field.add(assigneToTitleField);

                                var assignToContentRequiredTextLabel = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(assigneToTitleField.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                assigned_to_Field.add(assignToContentRequiredTextLabel);

                                var assignToContentField = Ti.UI.createLabel({
                                        right:10,
                                        width:self.set_a_field_width_in_table_view_row(assigneToTitleField.text),
                                        textAlign:'right',
                                        text:((_selected_assigned_to === undefined)||(_selected_assigned_to === null)||(_selected_assigned_to === ''))?'N/A':self.display_time_and_date(self.get_seconds_value_by_time_string(_selected_assigned_to)),
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                assigned_to_Field.add(assignToContentField);
                                if((_selected_assigned_to === undefined)||(_selected_assigned_to === null)||(_selected_assigned_to === '')){
                                        assignToContentField.visible = false;
                                }else{
                                        assignToContentRequiredTextLabel.visible = false;
                                }
                                self.data.push(assigned_to_Field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_assigned_to_field');
                                return; 
                        }                                  
                }
                /**
                 *  init delete button field
                 */                
                function _init_delete_btn(){
                        try{
                                var deleteButtonField = Ti.UI.createTableViewRow({
                                        className:'set_delete_button',
                                        filter_class:'set_delete_button',
                                        header:''
                                });
                                var deleteButton = Ti.UI.createButton({
                                        title:'Delete',
                                        backgroundImage:self.get_file_path('image','BUTT_red_off.png'),
                                        textAlign:'center',
                                        height:self.default_table_view_row_height,
                                        width:(self.is_ipad())?self.screen_width-self.ipad_button_reduce_length_in_tableview:self.screen_width-self.iphone_button_reduce_length_in_tableview
                                });
                                deleteButtonField.add(deleteButton);
                                self.data.push(deleteButtonField);
                                deleteButton.addEventListener('click',function(){
                                        _delete_btn_click_event();
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_delete_btn');
                                return; 
                        }                                  
                }
                /**
                 *  event when click assigned user type
                 */
                function _event_for_assigned_user_code(e){
                        try{
                                var allocated_personnel_type_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'base/select_unique_code_from_table_view.js'),
                                        win_title:'Select Assigned User Type',
                                        table_name:'my_job_assigned_user_code',//table name
                                        display_name:'name',//need to shwo field
                                        existed_id_array:'',
                                        content:e.row.job_assigned_user_code,
                                        content_value:e.row.job_assigned_user_code_name,
                                        source:'job_assigned_user_code'
                                });
                                Titanium.UI.currentTab.open(allocated_personnel_type_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_assigned_user_code');
                                return; 
                        }                                  
                }
                /**
                 *  event when click assigned user
                 */
                function _event_for_assigned_user(e){
                        try{
                                var allocated_personnel_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'base/select_unique_value_from_table_view_with_search_bar.js'),
                                        win_title:'Select Assigned User',
                                        table_name:'my_manager_user',//table name
                                        display_name:'display_name',//need to shwo field
                                        query_array:['company_id='+_selected_company_id,'status_code=1'],//query field
                                        fuzzy_query:'display_name',//fuzzy query's fields'
                                        existed_id_array:'',
                                        content:_selected_manager_user_id,
                                        content_value:e.row.job_assigned_user_name,
                                        source:'job_assigned_user'
                                });
                                Titanium.UI.currentTab.open(allocated_personnel_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_assigned_user');
                                return; 
                        }                                  
                }
                /**
                 *  event when click assigned from
                 */
                function _event_for_assigned_from(e){
                        try{
                                var new_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'job/base/job_date_and_time.js'),
                                        content:self.get_seconds_value_by_time_string(_selected_assigned_from),
                                        type:_type,
                                        job_id:_selected_job_id,
                                        scheduled_time_type:'from',
                                        source:'job_assigned_user_scheduled_from'                                        
                                });
                                Titanium.UI.currentTab.open(new_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_assigned_from');
                                return; 
                        }                                  
                }
                /**
                 *  event when click assigned to
                 */
                function _event_for_assigned_to(e){
                        try{
                                var temp_content = _selected_assigned_to;
                                if((_selected_assigned_to === undefined)&&(_selected_assigned_from != undefined)){
                                        temp_content = _selected_assigned_from;
                                }                                
                                var new_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'job/base/job_date_and_time.js'),
                                        content:self.get_seconds_value_by_time_string(temp_content),
                                        type:_type,
                                        job_id:_selected_job_id,
                                        scheduled_time_type:'to',
                                        source:'job_assigned_user_scheduled_to'  
                                });
                                Titanium.UI.currentTab.open(new_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_assigned_to');
                                return; 
                        }                                  
                }
                /**
                 *  event when click delete button
                 */
                function _delete_btn_click_event(){
                        try{
                                var optionDialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['YES','NO','']:['YES','NO'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:1,
                                        title:L('message_delete_item_in_job_assigned_user')
                                });
                                optionDialog.show();
                                optionDialog.addEventListener('click',function(e){
                                        if(e.index === 0){
                                                var db = Titanium.Database.open(self.get_db_name());
                                                if(_selected_job_assigned_user_id > 1000000000){
                                                        db.execute('DELETE FROM my_'+_type+'_assigned_user WHERE id=?',_selected_job_assigned_user_id);
                                                }else{
                                                        db.execute('UPDATE my_'+_type+'_assigned_user SET changed=?,status_code=?  WHERE id='+_selected_job_assigned_user_id,
                                                                1,2
                                                                );
                                                }
                                                db.close();
                                                win.close();
                                        }
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _delete_btn_click_event');
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
                                        var rows = db.execute('SELECT * FROM my_'+_type+'_assigned_user WHERE id=?',_selected_job_assigned_user_id);
                                        if((rows != null) && (rows.isValidRow())){
                                                if(_selected_job_assigned_user_code != rows.fieldByName('job_assigned_user_code')){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_selected_manager_user_id != rows.fieldByName('manager_user_id'))){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_selected_assigned_from != rows.fieldByName('assigned_from'))){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_selected_assigned_to != rows.fieldByName('assigned_to'))){
                                                        is_make_changed = true;
                                                }
                                        }
                                        if(rows != null){
                                                rows.close();
                                        }
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
                        if(job_base_assigned_user_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_assigned_user_page.prototype = new F();
                                job_base_assigned_user_page.prototype.constructor = job_base_assigned_user_page;
                                job_base_assigned_user_page_obj = new job_base_assigned_user_page();
                                job_base_assigned_user_page_obj.init();
                        }else{
                                job_base_assigned_user_page_obj.update_field_value_after_set_properites(); 
                        }
                }catch(err){
                        alert(err);
                        return;
                }                        
        });

        win.addEventListener('close',function(){
                try{
                        job_base_assigned_user_page_obj.close_window();
                        job_base_assigned_user_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                        
        });
    
}());