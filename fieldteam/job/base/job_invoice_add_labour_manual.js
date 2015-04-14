/**
 *  Description: job invoice editor
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var job_invoice_add_labour_manual_page_obj = null;

        function job_invoice_add_labour_manual_page(){
                var self = this;
                var window_source = 'job_invoice_add_labour_manual_page';
                if(win.action_for_job_invoice_labour_manual == 'edit_job_invoice_labour_manual'){
                        win.title = 'Edit Operation Time';
                }else{
                        win.title = 'Add Operation Time';
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
                                _init_manager_user_field();
                                _init_operation_time_field();
                                _init_operation_duration_field();
                                _init_operation_rate_field();
                                _init_operation_price_field();
                                if((_action_for_job_invoice_labour_manual == 'edit_job_invoice_labour_manual') && (_selected_job_operation_manual_id > 1000000000)){
                                        _init_delete_btn();
                                }
                                //call int_table_view function of parent class: fieldteam.js
                                self.init_table_view(); 
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_is_operation_duration_focused && (_selected_field_object != null)){
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
                                //check company include gst or not
                                rows = db.execute('SELECT * FROM my_company WHERE id=?',_selected_company_id);
                                if(rows.isValidRow()){
                                        _company_gst_exempt = rows.fieldByName('is_gst_exempt');
                                        _tax_name = rows.fieldByName('tax');
                                        _tax_amount = rows.fieldByName('tax_amount');
                                        if(self.trim(_tax_name) == ''){
                                                _tax_name = self.gst_default_name;
                                        }                                        
                                }
                                rows.close();      
                                db.close();
                                
                                if(_selected_job_operation_manual_id > 0){
                                        db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_'+_type+'_operation_manual WHERE id=?',_selected_job_operation_manual_id);
                                        if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                _operation_user = rows.fieldByName('operation_user');
                                                _operation_duration = (_operation_duration != '')?_operation_duration:rows.fieldByName('operation_duration');
                                                Ti.API.info("_operation_duration:"+_operation_duration);
                                                _operation_time = rows.fieldByName('operation_time');
                                                _operation_rate = self.currency_formatted(parseFloat(rows.fieldByName('operation_rate')));
                                                _operation_price = (_operation_duration != '')?self.currency_formatted((parseFloat(_operation_duration)*parseFloat(_operation_rate))):self.currency_formatted(parseFloat(rows.fieldByName('operation_price')));
                                                _operation_price = self.currency_formatted(parseFloat(_operation_duration)*parseFloat(_operation_rate));
                                                if(!_company_gst_exempt){
                                                        if(_tax_amount > 0){
                                                                _operation_price = self.currency_formatted(parseFloat(_operation_duration)*parseFloat(self.currency_formatted(_operation_rate*(1+_tax_amount/100))));
                                                        }                                               
                                                }                                                  
                                                Ti.API.info("_operation_price:"+_operation_price);
                                        }
                                        rows.close();
                                        db.close();          
                                }else{
                                        _operation_rate = '0.00';
                                        _operation_price = '0.00';
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
                                        }
                                        if(error_string != ''){
                                                self.show_message(error_string);
                                                return;
                                        }


                                        var db = Titanium.Database.open(self.get_db_name());
                                        var d = new Date();
                                                                        
                                        if(_selected_job_operation_manual_id > 0){//update
                                                db.execute('UPDATE my_'+_type+'_operation_manual SET '+_type+'_id=?,operation_user=?,operation_time=?,operation_duration=?,operation_rate=?,operation_price=?,'+
                                                        'changed=?  WHERE id='+_selected_job_operation_manual_id,
                                                        _selected_job_id,
                                                        _operation_user,
                                                        _operation_time,
                                                        _operation_duration,
                                                        _operation_rate,
                                                        _operation_price,
                                                        1);
                                        }else{//add
                                                var new_time_value = parseInt(d.getTime(), 10);
                                                db.execute('INSERT INTO my_'+_type+'_operation_manual (id,local_id,'+_type+'_id,operation_user,operation_time,operation_duration,operation_rate,operation_price,'+
                                                        'status_code,changed)'+
                                                        'VALUES(?,?,?,?,?,?,?,?,?,?)',
                                                        new_time_value,
                                                        _selected_company_id+'-'+_selected_user_id+'-'+new_time_value,
                                                        _selected_job_id,
                                                        _operation_user,
                                                        _operation_time,
                                                        _operation_duration,
                                                        _operation_rate,
                                                        _operation_price,
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
                                        case 'set_invoice_manager_user':
                                                _event_for_manager_user(e);
                                                break;
                                        case 'set_invoice_operation_time':
                                                _event_for_operation_time(e);
                                                break;
                                        case 'set_delete_button':
                                                _event_for_delete_btn();
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
                                if(Ti.App.Properties.getBool('job_invoice_enter_username_flag')){
                                        _manager_user_id = 0;
                                        var new_operation_user = Ti.App.Properties.getString('job_invoice_enter_username_content');
                                        var new_operation_rate = self.currency_formatted(parseFloat(Ti.App.Properties.getString('job_invoice_enter_rate_content')));   
                                        var new_operation_price = self.currency_formatted(parseFloat(_operation_duration)*parseFloat(new_operation_rate));
                                        if(!_company_gst_exempt){
                                                if(_tax_amount > 0){
                                                        new_operation_price = self.currency_formatted(parseFloat(_operation_duration)*parseFloat(self.currency_formatted(new_operation_rate*(1+_tax_amount/100))));
                                                }                                               
                                        }                                        

                                        if(_current_selected_row != null){                                         
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = new_operation_user;
                                                if((_current_selected_row.operation_user === '')||(_current_selected_row.operation_user === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                  
                                        }
                                        if(new_operation_user != _operation_user || new_operation_rate != _operation_rate){
                                                _is_make_changed = true;
                                                if(_operation_rate_row != null){
                                                        _operation_rate_row.children[_operation_rate_row.children.length-1].text = _selected_currency+new_operation_rate;
                                                }
                                                if(_operation_price_row != null){
                                                        _operation_price_row.children[_operation_price_row.children.length-1].text = _selected_currency+new_operation_price;
                                                }     
                                                _operation_user = new_operation_user;
                                                _operation_rate = new_operation_rate;
                                                _operation_price = new_operation_price;
                                                _old_manager_user_id = _manager_user_id = 0;
                                        }                                         
                                        Ti.App.Properties.setBool('job_invoice_enter_username_flag',false);
                                }                                
                                if(Ti.App.Properties.getBool('update_job_invoice_operation_time_view_flag')){
                                        _operation_time = Ti.App.Properties.getString('update_job_invoice_operation_time_view_content');
                                        if(_current_selected_row != null){
                                                _current_selected_row.operation_time = _operation_time;
                                                var temp_str = self.display_time_and_date(self.get_seconds_value_by_time_string(_current_selected_row.operation_time));
                                                var temp_arr = temp_str.split(' ');
                                                if(temp_arr.length > 1){
                                                        temp_arr.pop();
                                                }
                                                temp_str = temp_arr.join(' ');
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = temp_str;
                                                if((_current_selected_row.operation_time === '')||(_current_selected_row.operation_time === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }   
                                        }
                                        if(_old_operation_time !=_operation_time){
                                                _is_make_changed = true;
                                                _old_operation_time = _operation_time;
                                        }                                        
                                        Ti.App.Properties.setBool('update_job_invoice_operation_time_view_flag',false);
                                }     
                                if(Ti.App.Properties.getBool('update_unique_code_with_search_job_invoice_operation_manual_manager_user_view_flag')){
                                        _manager_user_id = Ti.App.Properties.getString('update_unique_code_with_search_job_invoice_operation_manual_manager_user_view_id');
                                        _operation_user = Ti.App.Properties.getString('update_unique_code_with_search_job_invoice_operation_manual_manager_user_view_content');                                        
                                        if(_current_selected_row != null){                                 
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _operation_user;
                                                if((_operation_user === '')||(_operation_user === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        if(_old_manager_user_id != _manager_user_id){
                                                _is_make_changed = true;
                                                var db = Titanium.Database.open(self.get_db_name());
                                                var row = db.execute('select * from my_manager_user where id=?',_manager_user_id);
                                                if(row.isValidRow()){
                                                        _operation_rate = self.currency_formatted(parseFloat(row.fieldByName('rate_per_hour')));
                                                        new_operation_price = self.currency_formatted(parseFloat(_operation_duration)*parseFloat(self.currency_formatted(parseFloat(_operation_rate))));
                                                        if(!_company_gst_exempt){
                                                                if(_tax_amount > 0){
                                                                        new_operation_price = self.currency_formatted(parseFloat(_operation_duration)*parseFloat(self.currency_formatted(parseFloat(_operation_rate)*(1+_tax_amount/100))));
                                                                        Ti.API.info("new_operation_price2:"+new_operation_price);
                                                                }                                                                                                                                    
                                                        }
                                                }
                                                db.close();
                                                if(_operation_rate_row != null){
                                                        _operation_rate_row.children[_operation_rate_row.children.length-1].text = _selected_currency+_operation_rate;
                                                }
                                                if(_operation_price_row != null){
                                                        _operation_price_row.children[_operation_price_row.children.length-1].text = _selected_currency+new_operation_price;
                                                }     
                                                _operation_price = new_operation_price;
                                                _old_manager_user_id = _manager_user_id;
                                        }
                                        Ti.App.Properties.setBool('update_unique_code_with_search_job_invoice_operation_manual_manager_user_view_flag',false);
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.update_field_value_after_set_properites');
                                return;
                        }
                };                         
                
                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _action_for_job_invoice_labour_manual = win.action_for_job_invoice_labour_manual;
                var _type = win.type;
                var _selected_job_id = ((win.job_id == undefined) || (win.job_id == null))?0:win.job_id;
                var _selected_job_operation_manual_id = ((win.job_operation_manual_id == undefined) || (win.job_operation_manual_id == null))?0:win.job_operation_manual_id;
                var _manager_user_id =0,_old_manager_user_id=0;
                var _operation_user = '';
                var _operation_duration = (win.duration == undefined || win.duration == null)?'':win.duration;
                var _operation_time = '',_old_operation_time = '';
                var _operation_rate = '';
                var _operation_price = '';
                var _current_field_num=0;
                var _current_selected_row = null;
                var _is_make_changed = false;
                var _selected_field_object = null;
                var _is_operation_duration_focused = false; 
                var _operation_rate_row = null;
                var _operation_price_row = null;
                var _company_gst_exempt = 0;
                var _tax_name = '';
                var _tax_amount = 0;
                var _selected_currency = self.get_selected_currency();
                //private method

                /**
                 *  init manager user field
                 */
                function _init_manager_user_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = true;
                                var manager_user_full_name = '';
                                if(_action_for_job_invoice_labour_manual == 'edit_job_invoice_labour_manual'){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_'+_type+'_operation_manual WHERE id=?',_selected_job_operation_manual_id);
                                        if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                manager_user_full_name = (rows.fieldByName('operation_user') == '')?'':rows.fieldByName('operation_user');
                                        }
                                        rows.close();
                                        db.close();
                                }
                                var manager_user_row_field = Ti.UI.createTableViewRow({
                                        className:'set_invoice_manager_user',
                                        filter_class:'set_invoice_manager_user',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value,
                                        valuePrompt:'Please select user.',//for check value
                                        hasChild:true,
                                        height:((manager_user_full_name === '')||(manager_user_full_name === null))?self.default_table_view_row_height:'auto'
                                });
                                var manager_user_name_field = Ti.UI.createLabel({
                                        text:'Name',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                manager_user_row_field.add(manager_user_name_field);

                                var manager_user_name_required_text_label = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(manager_user_name_field.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                manager_user_row_field.add(manager_user_name_required_text_label);

                                var manager_user_name_content_field = Ti.UI.createLabel({
                                        right:10,
                                        width:self.set_a_field_width_in_table_view_row(manager_user_name_field.text),
                                        textAlign:'right',
                                        text:manager_user_full_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                manager_user_row_field.add(manager_user_name_content_field);
                                if((manager_user_full_name === '')||(manager_user_full_name === null)){
                                        manager_user_name_content_field.visible = false;
                                }else{
                                        manager_user_name_required_text_label.visible = false;
                                }
                                self.data.push(manager_user_row_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_manager_user_field');
                                return;
                        }                                     
                }
                /**
                 *  init operation date field
                 */
                function _init_operation_time_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = true;
                                var operation_time_row_field = Ti.UI.createTableViewRow({
                                        operation_time:_operation_time,
                                        className:'set_invoice_operation_time',
                                        filter_class:'set_invoice_operation_time',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value,
                                        valuePrompt:'Please set date.',//for check value
                                        hasChild:true,
                                        height:self.default_table_view_row_height
                                });                                
                                var operation_time_title_field = Ti.UI.createLabel({
                                        text:'Date',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                operation_time_row_field.add(operation_time_title_field);

                                var operation_time_required_text_label = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(operation_time_title_field.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                operation_time_row_field.add(operation_time_required_text_label);

                                var operation_time_content_field = Ti.UI.createLabel({
                                        right:10,
                                        width:self.set_a_field_width_in_table_view_row(operation_time_title_field.text),
                                        textAlign:'right',
                                        text:self.display_date_only(self.get_seconds_value_by_time_string(_operation_time)),
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                operation_time_row_field.add(operation_time_content_field);
                                if((_operation_time === '')||(_operation_time === null)){
                                        operation_time_content_field.visible = false;
                                }else{
                                        operation_time_required_text_label.visible = false;
                                }
                                self.data.push(operation_time_row_field);                               
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_operation_time_field');
                                return;
                        }                                     
                }
                /**
                 *  init operation duration  field
                 */
                function _init_operation_duration_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = true;                                   
                                var operation_duration_row_Field = Ti.UI.createTableViewRow({
                                        className:'set_invoice_operation_duration',
                                        filter_class:'set_invoice_operation_duration',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter duration.',//for check value
                                        height:self.default_table_view_row_height
                                });                                
                                var operation_duration_title_Field = Ti.UI.createLabel({
                                        text:'Duration (h)',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                operation_duration_row_Field.add(operation_duration_title_Field);

                                var operation_duration_content_Field = Ti.UI.createTextField({
                                        right:30,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(operation_duration_title_Field.text),
                                        textAlign:'right',
                                        keyboardType:Titanium.UI.KEYBOARD_DECIMAL_PAD,
                                        value:_operation_duration,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                operation_duration_row_Field.add(operation_duration_content_Field);
                                self.data.push(operation_duration_row_Field);
                                
                                operation_duration_content_Field.addEventListener('change',function(e){
                                        _operation_duration = e.value;
                                        var new_operation_price= 0;
                                        if(!_company_gst_exempt){
                                                if(_tax_amount > 0){
                                                        new_operation_price = self.currency_formatted(parseFloat(_operation_duration)*parseFloat(self.currency_formatted(parseFloat(_operation_rate)*(1+_tax_amount/100))));
                                                }                                                                                                                                    
                                        }                                        
                                        if(_operation_price_row != null){
                                                _operation_price_row.children[_operation_price_row.children.length-1].text = _selected_currency+new_operation_price;
                                        }                                         
                                        _operation_price = new_operation_price;
                                        _is_make_changed = true;
                                });
                                operation_duration_content_Field.addEventListener('focus',function(e){                                        
                                        _is_operation_duration_focused = true;
                                        _selected_field_object = e.source;
                                });
                                operation_duration_content_Field.addEventListener('blur',function(e){
                                        _is_operation_duration_focused = false;
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_operation_duration_field');
                                return;
                        }                                     
                }
                /**
                 *  init operation rate field
                 */
                function _init_operation_rate_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = false;
                                var operation_rate_row_field = Ti.UI.createTableViewRow({
                                        className:'set_invoice_operation_rate',
                                        filter_class:'set_invoice_operation_rate',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value,
                                        valuePrompt:'',//for check value
                                        hasChild:false,
                                        height:self.default_table_view_row_height
                                });
                                
                                _operation_rate_row = operation_rate_row_field;
                                
                                var operation_rate_title_field = Ti.UI.createLabel({
                                        text:(_company_gst_exempt)?'Rate':'Rate (No '+_tax_name+')',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                operation_rate_row_field.add(operation_rate_title_field);

                                var operation_rate_content_field = Ti.UI.createLabel({
                                        right:10,
                                        width:self.set_a_field_width_in_table_view_row(operation_rate_title_field.text),
                                        textAlign:'right',
                                        text:_selected_currency+_operation_rate,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                operation_rate_row_field.add(operation_rate_content_field);
                                self.data.push(operation_rate_row_field);                               
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_operation_rate_field');
                                return;
                        }                                      
                }
                /**
                 *  init operation price field
                 */
                function _init_operation_price_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = false;
                                var operation_price_row_field = Ti.UI.createTableViewRow({
                                        className:'set_invoice_operation_price',
                                        filter_class:'set_invoice_operation_price',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value,
                                        valuePrompt:'.',//for check value
                                        hasChild:false,
                                        height:self.default_table_view_row_height
                                });
                                
                                _operation_price_row = operation_price_row_field;
                                
                                var operation_price_title_field = Ti.UI.createLabel({
                                        text:_company_gst_exempt?'Price':'Price (Inc '+_tax_name+')',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                operation_price_row_field.add(operation_price_title_field);

                                var operation_price_content_field = Ti.UI.createLabel({
                                        right:10,
                                        width:self.set_a_field_width_in_table_view_row(operation_price_title_field.text),
                                        textAlign:'right',
                                        text:_selected_currency+_operation_price,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                operation_price_row_field.add(operation_price_content_field);
                                self.data.push(operation_price_row_field);                               
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_operation_price_field');
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
                 *  select manager user
                 */
                function _event_for_manager_user(e){
                        try{
                                var optionDialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['Select User','Enter User','Cancel','']:['Select User','Enter User','Cancel'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:2,
                                        title:'Please select option.'
                                });
                                optionDialog.show();
                                optionDialog.addEventListener('click',function(e){
                                        switch(e.index){
                                                case 0:
                                                        var temp_win = Ti.UI.createWindow({
                                                                url:self.get_file_path('url', 'base/select_unique_value_from_table_view_with_search_bar.js'),
                                                                win_title:'Select User',
                                                                table_name:'my_manager_user',//table name
                                                                display_name:'display_name',//need to shwo field
                                                                query_array:['company_id='+_selected_company_id,'status_code=1'],//query field
                                                                fuzzy_query:'display_name',//fuzzy query's fields'
                                                                existed_id_array:'',
                                                                content:0,
                                                                content_value:'',
                                                                source:'job_invoice_operation_manual_manager_user'
                                                        });
                                                        Ti.UI.currentTab.open(temp_win,{
                                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                        });                                                        
                                                        break;
                                                case 1:
                                                        var username_win = Ti.UI.createWindow({
                                                                url:self.get_file_path('url','job/base/job_invoice_enter_user_and_rate.js'),
                                                                username:_operation_user,
                                                                rate:_operation_rate
                                                        });
                                                        Ti.UI.currentTab.open(username_win,{
                                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                        });
                                                        break;
                                        }
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_manager_user');
                                return; 
                        }                            
                }                
                /**
                 *  set date
                 */
                function _event_for_operation_time(e){
                        try{
                                Ti.API.info('_operation_time:'+_operation_time);
                                var temp_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'job/base/job_invoice_operation_time.js'),
                                        content:_operation_time
                                });
                                Titanium.UI.currentTab.open(temp_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_operation_time');
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
                                        title:L('message_delete_operation_time_in_job_invoice')
                                });
                                optionDialog.show();
                                optionDialog.addEventListener('click',function(e){
                                        if(e.index === 0){
                                                var db = Titanium.Database.open(self.get_db_name());
                                                if(_selected_job_operation_manual_id > 1000000000){
                                                        db.execute('DELETE FROM my_'+_type+'_operation_manual WHERE id=?',_selected_job_operation_manual_id);
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
                 * display select date page
                 */
                function _display_select_date_page(e){
                        try{
                                var address_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'job/base/job_invoice_operation_time.js'),
                                        content:_operation_time
                                });
                                Titanium.UI.currentTab.open(address_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_select_date_page');
                                return; 
                        }                                   
                }          
                /**
                 *  check if exist any change
                 */
                function _check_if_exist_change(){
                        try{
                                return _is_make_changed;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_exist_change');
                                return false; 
                        }   
                }                 
        }

        win.addEventListener('focus',function(){
                try{
                        if(job_invoice_add_labour_manual_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_invoice_add_labour_manual_page.prototype = new F();
                                job_invoice_add_labour_manual_page.prototype.constructor = job_invoice_add_labour_manual_page;
                                job_invoice_add_labour_manual_page_obj = new job_invoice_add_labour_manual_page();
                                job_invoice_add_labour_manual_page_obj.init();
                        }else{
                                job_invoice_add_labour_manual_page_obj.update_field_value_after_set_properites(); 
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_invoice_add_labour_manual_page_obj.close_window();
                        job_invoice_add_labour_manual_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());