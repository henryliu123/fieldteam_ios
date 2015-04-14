/**
 *  Description: job invoice editor
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var job_purchase_order_item_page_obj = null;

        function job_purchase_order_item_page(){
                var self = this;
                var window_source = 'job_purchase_order_item_page';
                if(win.action_for_job_invoice_labour_manual == 'edit_purchase_order_item'){
                        win.title = 'Edit Item';
                }else{
                        win.title = 'Add Item';
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
                                _init_purchase_order_item_name_field();
                                _init_purchase_order_item_units_field();
                                if((_action_for_purchase_order_item == 'edit_purchase_order_item') && (_selected_purchase_order_item_id > 1000000000)){
                                        _init_delete_btn();
                                }
                                //call int_table_view function of parent class: fieldteam.js
                                self.init_table_view(); 
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_is_purchase_order_item_name_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }                                           
                                        if(_is_purchase_order_item_units_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }                                      
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
                                                                        
                                if(_selected_purchase_order_item_id > 0){//update
                                        db.execute('UPDATE my_purchase_order_item SET purchase_order_id=?,item_name=?,units=?,'+
                                                'changed=?  WHERE id='+_selected_purchase_order_item_id,
                                                _selected_purchase_order_id,
                                                _purchase_order_item_name,
                                                _purchase_order_item_units,
                                                1);
                                }else{//add
                                        var new_time_value = parseInt(d.getTime(), 10);
                                        db.execute('INSERT INTO my_purchase_order_item (id,local_id,company_id,purchase_order_id,item_name,units,'+
                                                'status_code,changed)'+
                                                'VALUES(?,?,?,?,?,?,?,?)',
                                                new_time_value,
                                                _selected_company_id+'-'+_selected_user_id+'-'+new_time_value,
                                                _selected_company_id,
                                                _selected_purchase_order_id,
                                                _purchase_order_item_name,
                                                _purchase_order_item_units,
                                                1,
                                                1);
                                }
                                db.close();
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
                                var index = e.index;
                                var filter_class = self.data[index].filter_class;
                                switch(filter_class){
                                        case 'set_delete_button':
                                                _event_for_delete_btn();
                                                break;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                        
                };                                                  
                
                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _action_for_purchase_order_item = win.action_for_purchase_order_item;
                var _selected_purchase_order_id = ((win.purchase_order_id == undefined) || (win.purchase_order_id == null))?0:win.purchase_order_id;
                var _selected_purchase_order_item_id = ((win.purchase_order_item_id == undefined) || (win.purchase_order_item_id == null))?0:win.purchase_order_item_id;
                var _purchase_order_item_name = ((win.purchase_order_item_name == undefined) || (win.purchase_order_item_name == null))?'':win.purchase_order_item_name;
                var _purchase_order_item_units = ((win.purchase_order_item_units == undefined) || (win.purchase_order_item_units == null))?'':win.purchase_order_item_units;
                var _current_field_num=0;
                var _selected_field_object = null;
                var _is_purchase_order_item_name_focused = false; 
                var _is_purchase_order_item_units_focused = false; 
                var _is_make_changed = false;
                //private method

                /**
                 *  init item name field
                 */
                function _init_purchase_order_item_name_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = true;
                                var item_name_row_field = Ti.UI.createTableViewRow({
                                        className:'set_item_name',
                                        filter_class:'set_item_name',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter item name.',//for check value
                                        hasChild:false,
                                        height:((_purchase_order_item_name === '')||(_purchase_order_item_name === null))?self.default_table_view_row_height:'auto'
                                });                               
                                var item_name_label_field = Ti.UI.createLabel({
                                        text:'Item Name',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                item_name_row_field.add(item_name_label_field);

                                var item_name_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(item_name_label_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:'Required',
                                        textAlign:'right',
                                        right:30,
                                        value:_purchase_order_item_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                }); 
                                item_name_row_field.add(item_name_field);
                                item_name_row_field.addEventListener('change',function(e){
                                        _purchase_order_item_name = e.value;
                                        _is_make_changed = true;
                                });
                                item_name_row_field.addEventListener('focus',function(e){                                        
                                        _is_purchase_order_item_name_focused = true;
                                        _selected_field_object = e.source;
                                });
                                item_name_row_field.addEventListener('blur',function(e){
                                        _is_purchase_order_item_name_focused = false;
                                        _selected_field_object = null;
                                });                                  
                                self.data.push(item_name_row_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_purchase_order_item_name_field');
                                return;
                        }                                     
                }
                /**
                 *  init operation unit  field
                 */
                function _init_purchase_order_item_units_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = true;                                   
                                var item_units_row_Field = Ti.UI.createTableViewRow({
                                        className:'set_item_units',
                                        filter_class:'set_item_units',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter units.',//for check value
                                        height:self.default_table_view_row_height
                                });                                
                                var item_units_label_field = Ti.UI.createLabel({
                                        text:'Units',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                item_units_row_Field.add(item_units_label_field);

                                var item_units_content_Field = Ti.UI.createTextField({
                                        right:30,
                                        hintText:'Required',
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(item_units_label_field.text),
                                        textAlign:'right',
                                        keyboardType:Titanium.UI.KEYBOARD_DECIMAL_PAD,
                                        value:_purchase_order_item_units,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                item_units_row_Field.add(item_units_content_Field);
                                self.data.push(item_units_row_Field);
                                
                                item_units_content_Field.addEventListener('change',function(e){
                                        _purchase_order_item_units = e.value;
                                        _is_make_changed = true;
                                });
                                item_units_content_Field.addEventListener('focus',function(e){                                        
                                        _is_purchase_order_item_units_focused = true;
                                        _selected_field_object = e.source;
                                });
                                item_units_content_Field.addEventListener('blur',function(e){
                                        _is_purchase_order_item_units_focused = false;
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_purchase_order_item_units_field');
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
                                                
                                                if(_selected_purchase_order_item_id > 1000000000){
                                                        var db = Titanium.Database.open(self.get_db_name());
                                                        db.execute('DELETE FROM my_purchase_order_item WHERE id=?',_selected_purchase_order_item_id);
                                                        db.close();
                                                }
                                               
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
                
                function _check_if_exist_change(){
                        try{
                                return  _is_make_changed;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_exist_change');
                                return false; 
                        }                          
                }
        }

        win.addEventListener('focus',function(){
                try{
                        if(job_purchase_order_item_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_purchase_order_item_page.prototype = new F();
                                job_purchase_order_item_page.prototype.constructor = job_purchase_order_item_page;
                                job_purchase_order_item_page_obj = new job_purchase_order_item_page();
                                job_purchase_order_item_page_obj.init();
                        }else{
                                job_purchase_order_item_page_obj.update_field_value_after_set_properites(); 
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_purchase_order_item_page_obj.close_window();
                        job_purchase_order_item_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());