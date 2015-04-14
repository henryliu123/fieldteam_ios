/**
 *  Description: job editor
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_booking_note_page_obj = null;

        function job_booking_note_page(){
                var self = this;
                var window_source = 'filter_job_filter_page';
                win.title = 'Edit Booking Note';

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
                                //call init_table_view function of parent class: fieldteam.js
                                if(!self.is_ios_7_plus()){
                                        _init_job_booking_note_field();
                                        self.init_table_view();
                                }else{
                                        _init_job_booking_note_field_for_ios7();
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
                                        _booking_note = rows.fieldByName('booking_note');
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
                                if(self.trim(_booking_note).length <=0){
                                        self.show_message(L('message_enter_booking_note_in_job_booking_note'));
                                        return;
                                }                                
                                if(_check_if_exist_change()){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_'+_type+' WHERE id=?',_selected_job_id);
                                        if(rows.getRowCount() > 0){
                                                db.execute('UPDATE my_'+_type+' SET booking_note=?,changed=? '+
                                                        ' WHERE id='+_selected_job_id,
                                                        _booking_note,
                                                        1);
                                        }else{
                                                db.execute('INSERT INTO my_'+_type+' (id,local_id,reference_number,company_id,title,booking_note,'+_type+'_status_code,status_code,changed)'+
                                                        'VALUES(?,?,?,?,?,?,?,?,?)',
                                                        _selected_job_id,
                                                        _selected_company_id+'-'+_selected_user_id+'-'+_selected_job_id,
                                                        _selected_job_id,
                                                        _selected_company_id,
                                                        'Untitled '+self.ucfirst(_type),
                                                        _booking_note,
                                                        0,
                                                        1,
                                                        1
                                                        );
                                        }
                                        rows.close();
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

                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _booking_note = '';
                var _is_make_changed = false;
                //private method
                function _init_job_booking_note_field(){
                        try{
                                var booking_note_field = Ti.UI.createTableViewRow({
                                        className:'set_job_booking_note',
                                        filter_class:'set_job_booking_note',
                                        height:'auto'
                                });
                                self.job_booking_note_content_field = Ti.UI.createTextArea({
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:200,
                                        textAlign:'left',
                                        top:5,
                                        bottom:5,
                                        left:10,
                                        right:10,
                                        value:_booking_note,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                booking_note_field.add(self.job_booking_note_content_field);
                                self.data.push(booking_note_field);
                                self.job_booking_note_content_field.addEventListener('change',function(e){
                                        _booking_note = e.value;
                                        _is_make_changed = true;
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_booking_note_field');
                                return;
                        }                                
                }
                function _init_job_booking_note_field_for_ios7(){
                        try{
                                self.job_booking_note_content_field = Ti.UI.createTextArea({
                                        borderWidth: 1, borderColor: '#ccc', borderRadius: 5,
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:200,
                                        textAlign:'left',
                                        top:5,
                                        bottom:5,
                                        left:10,
                                        right:10,
                                        value:_booking_note,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                win.add(self.job_booking_note_content_field);
                                self.job_booking_note_content_field.addEventListener('change',function(e){
                                        _booking_note = e.value;
                                        _is_make_changed = true;
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_booking_note_field_for_ios7');
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
                                        var rows = db.execute('SELECT * FROM my_'+_type+' WHERE id=?',_selected_job_id);
                                        if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                if(_booking_note != rows.fieldByName('booking_note')){
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
                        if(job_booking_note_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_booking_note_page.prototype = new F();
                                job_booking_note_page.prototype.constructor = job_booking_note_page;
                                job_booking_note_page_obj = new job_booking_note_page();
                                job_booking_note_page_obj.init();
                                job_booking_note_page_obj.job_booking_note_content_field.focus();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_booking_note_page_obj.close_window();
                        job_booking_note_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());