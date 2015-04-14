/**
 *  Description: select unique value from library table (e.g. my_job_priority_code,my_job_quote_status_code)
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_base_select_status_page_obj = null;
        function job_base_select_status_page(){
                var self = this;
                var window_source = 'job_base_select_status_page';
                win.title = 'Select Status';

                //public method
                self.init = function(){
                        try{       
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Done','Main,Back');
                                self.init_vars();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
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
                                var rows = db.execute('SELECT * FROM my_'+_type+'_status_code WHERE code not in('+_selected_job_status_code+') order by code asc');
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                if(rows.fieldByName('name').toLowerCase() != 'deleted'){
                                                        var row = Ti.UI.createTableViewRow({
                                                                className:'data_row_'+b,
                                                                title:rows.fieldByName('name'),
                                                                obj_id:rows.fieldByName('code'),
                                                                hasCheck:(rows.fieldByName('code') === _selected_job_status_code)?true:false
                                                        });
                                                        self.data.push(row);
                                                }
                                                rows.next();
                                                b++;
                                        }
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
                                if(!_is_a_row_checked){
                                        self.show_message('Please select status.');
                                        return;
                                }
                                if(_old_job_status_code === _selected_job_status_code){
                                        win.close();
                                }
                                if((_type === 'job')&&((_selected_job_status_code === 1))){
                                        if(win.source === 'from_job_index'){
                                                var db = Titanium.Database.open(self.get_db_name());
                                                var row = db.execute('SELECT * FROM my_'+_type+' WHERE id=?',_selected_job_id);
                                                if((row.getRowCount() > 0) && (row.isValidRow())){
                                                        db.execute('UPDATE my_'+_type+' SET '+_type+'_status_code=?,changed=1 WHERE id=?',_selected_job_status_code,_selected_job_id);
                                                }                                                
                                                row.close();
                                                
                                                if(_selected_job_status_code == 1){
                                                        Ti.App.Properties.setBool('is_close_timer',true);
                                                }                                                
//                                                var rows = db.execute('SELECT * from my_'+_type+'_operation_log WHERE '+_type+'_id=? and manager_user_id=? and status_code=1 order by logged desc,id desc',_selected_job_id,_selected_user_id);
//                                                if((rows != null) && (rows.isValidRow())){
//                                                        if(rows.fieldByName(_type+'_operation_log_type_code') === 1){                                                           
//                                                        }else{
//                                                                Ti.App.Properties.setBool('is_close_timer',true);
//                                                        }
//                                                }   
//                                                rows.close();
                                                db.close();                                         
                                        }else{
                                                Ti.App.Properties.setString('update_job_status_code_value',_selected_job_status_code); 
                                                Ti.App.Properties.setString('update_job_status_code_reason',''); 
                                                Ti.App.Properties.setBool('update_job_status_code_flag',true); 
                                        }
                                        win.close();
                                }else{
                                        //open reason window
                                        var new_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url','job/base/job_status_reason.js'),
                                                type:_type,
                                                job_id:_selected_job_id,
                                                job_status_code:_selected_job_status_code,
                                                parent_win:win,
                                                source:win.source
                                        });
                                        Ti.UI.currentTab.open(new_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        } 
                };                
                /**
                 *  override table_view_click_event function of parent class: fieldteam.js
                 */                    
                self.table_view_click_event = function(e){
                        try{
                                var index = e.index;
                                var section = e.section;
                                for(var i=0,j=self.data.length;i<j;i++){
                                        section.rows[i].hasCheck = false;
                                }
                                section.rows[index].hasCheck = true;
                                _selected_job_status_code = section.rows[index].obj_id;
                                _is_a_row_checked = true;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                        
                };

                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');                
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _old_job_status_code = win.job_status_code;
                var _selected_job_status_code = win.job_status_code;
                var _is_a_row_checked = false;   
                var _is_close_timer = false;
                              
        }

        win.addEventListener('open',function(e){
                try{
                        Ti.App.Properties.setBool('update_job_status_code_flag',false); 
                        if(job_base_select_status_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_select_status_page.prototype = new F();
                                job_base_select_status_page.prototype.constructor = job_base_select_status_page;
                                job_base_select_status_page_obj = new job_base_select_status_page();
                                //call parent class' function :init
                                job_base_select_status_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(e){
                try{
                        job_base_select_status_page_obj.close_window();
                        job_base_select_status_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });

}());

