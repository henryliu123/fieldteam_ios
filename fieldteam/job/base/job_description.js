/**
 *  Description: job editor
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_description_page_obj = null;

        function job_description_page(){
                var self = this;
                var window_source = 'job_description_page';
                win.title = 'Edit Description';

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
                                        _init_job_description_field();
                                        self.init_table_view();
                                }else{
                                        _init_job_description_field_for_ios7();
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
                                if(rows.isValidRow()){
                                        _description = rows.fieldByName('description');
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
                                if(self.trim(_description).length <=0){
                                        self.show_message(L('message_enter_description_in_job_description'));
                                        return;
                                }                                
                                if(_check_if_exist_change()){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var row = db.execute('SELECT * FROM my_'+_type+' WHERE id=?',_selected_job_id);
                                        if(row.getRowCount() > 0){
                                                db.execute('UPDATE my_'+_type+' SET description=?,changed=? '+
                                                        ' WHERE id='+_selected_job_id,
                                                        _description,
                                                        1);
                                        }else{
                                                db.execute('INSERT INTO my_'+_type+' (id,local_id,reference_number,company_id,title,description,'+_type+'_status_code,status_code,changed)'+
                                                        'VALUES(?,?,?,?,?,?,?,?,?)',
                                                        _selected_job_id,
                                                        _selected_company_id+'-'+_selected_user_id+'-'+_selected_job_id,
                                                        _selected_job_id,
                                                        _selected_company_id,
                                                        'Untitled '+self.ucfirst(_type),
                                                        _description,
                                                        0,
                                                        1,
                                                        1
                                                        );
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


                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _description = '';
                var _is_make_changed = false;
                //private method
                /**
                 *  init job description textarea field
                 */
                function _init_job_description_field(){
                        try{
                                var description_field = Ti.UI.createTableViewRow({
                                        className:'set_job_description',
                                        filter_class:'set_job_description',
                                        height:'auto'
                                });
                                self.job_description_content_field = Ti.UI.createTextArea({
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:200,
                                        textAlign:'left',
                                        top:5,
                                        bottom:5,
                                        left:10,
                                        right:10,
                                        value:_description,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                description_field.add(self.job_description_content_field);
                                self.data.push(description_field);
                                self.job_description_content_field.addEventListener('change',function(e){
                                        _description = e.value;
                                        _is_make_changed = true;
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_description_field');
                                return;
                        }                               
                }
                function _init_job_description_field_for_ios7(){
                        try{
                                self.job_description_content_field = Ti.UI.createTextArea({
                                        borderWidth: 1, borderColor: '#ccc', borderRadius: 5,
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:200,
                                        textAlign:'left',
                                        top:5,
                                        bottom:5,
                                        left:10,
                                        right:10,
                                        value:_description,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                win.add(self.job_description_content_field);
                                self.job_description_content_field.addEventListener('change',function(e){
                                        _description = e.value;
                                        _is_make_changed = true;
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_description_field_for_ios7');
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
                                        if(rows.isValidRow()){
                                                if(_description != rows.fieldByName('description')){
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
                        if(job_description_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_description_page.prototype = new F();
                                job_description_page.prototype.constructor = job_description_page;
                                job_description_page_obj = new job_description_page();
                                job_description_page_obj.init();
                                job_description_page_obj.job_description_content_field.focus();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_description_page_obj.close_window();
                        job_description_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());