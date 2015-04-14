/**
 *  Description: job status reason
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_status_reason_page_obj = null;

        function job_status_reason_page(){
                var self = this;
                var window_source = 'job_status_reason_page';
                win.title = 'Edit Status Reason';

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
                                        _init_job_status_reason_field();
                                        self.init_table_view();
                                }else{
                                        _init_job_status_reason_field_for_ios7();
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
                                if(_selected_job_status_log_id > 0){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_'+_type+'_status_log WHERE id=?',_selected_job_status_log_id);
                                        if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                _status_reason = rows.fieldByName('reason');
                                        }
                                        rows.close();
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
                                if(_check_if_exist_change()){
                                        if(self.trim(_status_reason).length <=0){
                                                self.show_message(L('message_enter_reason_in_job_status_reason'));
                                                return;
                                        }
                                        
                                        if(win.source === 'from_job_index'){
                                                var d = new Date();
                                                var new_time_value = parseInt(d.getTime(), 10);
                                                var db = Titanium.Database.open(self.get_db_name());
                                                db.execute('UPDATE my_'+_type+' set '+_type+'_status_code=?,changed=1 WHERE id=?',_selected_job_status_code,_selected_job_id);
                                                if(_selected_job_status_log_id > 0){
                                                        db.execute('UPDATE my_'+_type+'_status_log set reason=? WHERE id=?',_status_reason,_selected_job_status_log_id);
                                                }else{
                                                        db.execute('INSERT INTO my_'+_type+'_status_log (id,local_id,'+_type+'_id,'+_type+'_status_code,reason,'+
                                                                'manager_user_id,status_code,changed)'+
                                                                'VALUES(?,?,?,?,?,?,?,?)',
                                                                new_time_value,
                                                                _selected_company_id+'-'+_selected_user_id+'-'+new_time_value,
                                                                _selected_job_id,
                                                                _selected_job_status_code,
                                                                _status_reason,
                                                                _selected_user_id,
                                                                1,
                                                                1);
                                                }
                                                db.close();
                                        }else{
                                                Ti.App.Properties.setBool('update_job_status_code_flag',true); 
                                                Ti.App.Properties.setString('update_job_status_code_value',_selected_job_status_code); 
                                                Ti.App.Properties.setString('update_job_status_code_reason',_status_reason); 
                                        }

                                }
                                if(e.index == self.default_main_menu_button_index){//menu menu
                                        self.close_all_window_and_return_to_menu(); 
                                }else{     
                                        if(_parent_win != null){
                                               _parent_win.close();
                                        }                                        
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

                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_job_status_code = win.job_status_code;
                var _selected_job_status_log_id = (win.job_status_log_id === undefined)?0:win.job_status_log_id;
                var _status_reason = '';
                var _parent_win = (win.parent_win === undefined)?null:win.parent_win;
                //private method
                /**
                 *  init status reason field
                 */
                function _init_job_status_reason_field(){
                        try{
                                var status_reason_field = Ti.UI.createTableViewRow({
                                        className:'set_job_status_reason',
                                        filter_class:'set_job_status_reason',
                                        height:'auto',
                                        header:'Please enter reason'
                                });
                                self.job_status_reason_content_field = Ti.UI.createTextArea({
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:150,
                                        textAlign:'left',
                                        top:5,
                                        bottom:5,
                                        left:10,
                                        right:10,
                                        value:_status_reason,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                status_reason_field.add(self.job_status_reason_content_field);
                                self.data.push(status_reason_field);
                                self.job_status_reason_content_field.addEventListener('change',function(e){
                                        _status_reason = e.value;
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_status_reason_field');
                                return;
                        }
                }
                function _init_job_status_reason_field_for_ios7(){
                        try{
                                self.job_status_reason_content_field = Ti.UI.createTextArea({
                                        borderWidth: 1, borderColor: '#ccc', borderRadius: 5,
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:150,
                                        textAlign:'left',
                                        top:5,
                                        bottom:5,
                                        left:10,
                                        right:10,
                                        value:_status_reason,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                win.add(self.job_status_reason_content_field);
                                self.job_status_reason_content_field.addEventListener('change',function(e){
                                        _status_reason = e.value;
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_status_reason_field_for_ios7');
                                return;
                        }
                }                
                /**
                 *  check if exist any change
                 */
                function _check_if_exist_change(){
                        try{
                                var is_make_changed = false;
                                if(_selected_job_status_log_id <= 0){
                                        is_make_changed = true;
                                }else{
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_'+_type+'_status_log WHERE id=?',_selected_job_status_log_id);
                                        if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                if(_status_reason != rows.fieldByName('reason')){
                                                        is_make_changed = true;
                                                }
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

        win.addEventListener('open',function(){
                try{
                        if(job_status_reason_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_status_reason_page.prototype = new F();
                                job_status_reason_page.prototype.constructor = job_status_reason_page;
                                job_status_reason_page_obj = new job_status_reason_page();
                                job_status_reason_page_obj.init();
                                job_status_reason_page_obj.job_status_reason_content_field.focus();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_status_reason_page_obj.close_window();
                        job_status_reason_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());