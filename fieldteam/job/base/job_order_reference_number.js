/**
 *  Description: job editor
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_order_reference_number_page_obj = null;

        function job_order_reference_number_page(){
                var self = this;
                var window_source = 'job_order_reference_number_page';
                win.order_reference_number = 'Edit Order Ref#';

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
                                
                                //call int_table_view function of parent class: fieldteam.js
                                if(!self.is_ios_7_plus()){
                                        _init_job_order_reference_number_field();
                                        self.init_table_view();
                                }else{
                                        _init_job_order_reference_number_field_for_ios7();
                                }                                                              
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
                                var rows = db.execute('SELECT * FROM my_'+_type+' WHERE id=?',_selected_job_id);
                                if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                        _order_reference_number = rows.fieldByName('order_reference');
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
                                        var db = Titanium.Database.open(self.get_db_name());
                                        if(_selected_job_id > 0){//update
                                                db.execute('UPDATE my_'+_type+' SET order_reference=?,changed=? '+
                                                        ' WHERE id='+_selected_job_id,
                                                        _order_reference_number,
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
                                                order_reference_number:L('message_save_changes')
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

                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _order_reference_number = '';
                //private method

                /**
                 *  init job order_reference_number field
                 */
                function _init_job_order_reference_number_field(){
                        try{
                                var order_reference_number_field = Ti.UI.createTableViewRow({
                                        className:'set_job_order_reference_number',
                                        filter_class:'set_job_order_reference_number',
                                        height:'auto'
                                });
                                self.job_order_reference_number_content_field = Ti.UI.createTextArea({
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:150,
                                        textAlign:'left',
                                        top:5,
                                        bottom:5,
                                        left:10,
                                        right:10,
                                        value:_order_reference_number,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                order_reference_number_field.add(self.job_order_reference_number_content_field);
                                self.data.push(order_reference_number_field);
                                self.job_order_reference_number_content_field.addEventListener('change',function(e){
                                        _order_reference_number = e.value;
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_order_reference_number_field');
                                return;
                        }
                }          
                function _init_job_order_reference_number_field_for_ios7(){
                        try{
                                self.job_order_reference_number_content_field = Ti.UI.createTextArea({
                                        borderWidth: 1, borderColor: '#ccc', borderRadius: 5,
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:150,
                                        textAlign:'left',
                                        top:5,
                                        bottom:5,
                                        left:10,
                                        right:10,
                                        value:_order_reference_number,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                win.add(self.job_order_reference_number_content_field);
                                self.job_order_reference_number_content_field.addEventListener('change',function(e){
                                        _order_reference_number = e.value;
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_order_reference_number_field_for_ios7');
                                return;
                        }
                }                       
                /**
                 *  check if exist any change
                 */
                function _check_if_exist_change(){
                        try{
                                var is_make_changed = false;
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_'+_type+' WHERE id=?',_selected_job_id);
                                if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                        if(_order_reference_number != rows.fieldByName('order_reference')){
                                                is_make_changed = true;
                                        }
                                }
                                rows.close();
                                db.close(); 
                                return is_make_changed;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_exist_change');
                                return false; 
                        }   
                }                  
        }

        win.addEventListener('open',function(){
                try{
                        if(job_order_reference_number_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_order_reference_number_page.prototype = new F();
                                job_order_reference_number_page.prototype.constructor = job_order_reference_number_page;
                                job_order_reference_number_page_obj = new job_order_reference_number_page();
                                job_order_reference_number_page_obj.init();
                                job_order_reference_number_page_obj.job_order_reference_number_content_field.focus();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_order_reference_number_page_obj.close_window();
                        job_order_reference_number_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());