//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_edit_job_history_page_obj = null;

        function job_edit_job_history_page(){
                var self = this;
                var window_source = 'job_edit_job_history_page';
                win.title = 'Contact History';

                //public method
                /**
                 *  override init  function of parent class: fieldteam.js
                 */                     
                self.init = function(){
                        try{              
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('','Main,Back');
                                self.init_vars();                                                              
                                self.init_table_view();//inherite init_table_view function from parent class
                                self.init_no_result_label();//inherite init_no_result_label function from parent class
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }              
                };                
                /**
                 *  override ini_vars  function of parent class: fieldteam.js
                 */                  
                self.init_vars = function(){
                        try{
                                var temp_var = {};
                                var db = Titanium.Database.open(self.get_db_name());
                                var user_row = db.execute('SELECT * FROM my_manager_user WHERE company_id=?',_selected_company_id);
                                if(user_row != null){
                                        while(user_row.isValidRow()){
                                                temp_var = {
                                                        id:user_row.fieldByName('id'),
                                                        display_name:user_row.fieldByName('display_name')
                                                };
                                                _manager_user_array.push(temp_var);
                                                user_row.next();
                                        }
                                        user_row.close();
                                }
                                var contact_type_code_rows = db.execute('SELECT * FROM my_contact_type_code');
                                if(contact_type_code_rows != null){
                                        while(contact_type_code_rows.isValidRow()){
                                                temp_var = {
                                                        code:contact_type_code_rows.fieldByName('code'),
                                                        name:contact_type_code_rows.fieldByName('name')
                                                };
                                                _contact_type_code_array.push(temp_var);
                                                contact_type_code_rows.next();
                                        }
                                        contact_type_code_rows.close();                                        
                                }

                                var rows = db.execute('SELECT * FROM my_'+_type+'_contact_history WHERE status_code=1 and '+_type+'_id=? ORDER BY id desc',_selected_job_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var new_text = '';
                                                var temp_flag = 0;
                                                if(_contact_type_code_array.length > 0){
                                                        for(var i=0,j=_contact_type_code_array.length;i<j;i++){
                                                                if(_contact_type_code_array[i].code == rows.fieldByName('contact_type_code')){
                                                                        temp_flag = 1;
                                                                        new_text+='Type : '+_contact_type_code_array[i].name+'\n';
                                                                        break;
                                                                }
                                                        }
                                                        if(!temp_flag){
                                                                new_text+='Type : Unknown'+'\n';
                                                        }
                                                }else{
                                                        new_text+='Type : Unknown'+'\n';
                                                }  
                                                
                                                temp_flag = 0;
                                                if(_manager_user_array.length > 0){
                                                        for(i=0,j=_manager_user_array.length;i<j;i++){
                                                                if(_manager_user_array[i].id == rows.fieldByName('manager_user_id')){
                                                                        temp_flag = 1;
                                                                        new_text+='Sender : '+_manager_user_array[i].display_name+'\n';
                                                                        break;
                                                                }
                                                        }
                                                        if(!temp_flag){
                                                                new_text+='Sender : Unknown'+'\n';
                                                        }
                                                }else{
                                                        new_text+='Sender : Unknown'+'\n';
                                                }                                                 
                                                
                                                new_text+='Time : '+(((rows.fieldByName('contacted') === undefined) || (rows.fieldByName('contacted') === null))?'N/A':self.display_time_and_date(self.get_seconds_value_by_time_string(rows.fieldByName('contacted'))))+'\n';
                                                if(rows.fieldByName('description') != ''){
                                                        if(rows.fieldByName('description').length > 50){
                                                                temp_flag = 1;
                                                                new_text+='Description : '+rows.fieldByName('description').substr(0,50)+'...\n';
                                                        }else{
                                                                new_text+='Description : '+rows.fieldByName('description').substr(0,50)+'\n';
                                                        }
                                                }

                                                var new_row = Ti.UI.createTableViewRow({
                                                        className:'data_row_'+b,
                                                        filter_class:'job_contact_history',
                                                        hasChild:(temp_flag)?true:false,
                                                        height:'auto',
                                                        temp_flag:temp_flag,
                                                        job_id:rows.fieldByName(_type+'_id'),
                                                        job_contact_history_id:rows.fieldByName('id'),
                                                        job_contact_type_code:rows.fieldByName('contact_type_code')
                                                });
                                                new_row.add(Ti.UI.createLabel({
                                                        text:new_text,
                                                        textAlign:'left',
                                                        height:'auto',
                                                        width:(self.is_ipad())?self.screen_width-100:'auto',
                                                        left:10,
                                                        top:10,
                                                        bottom:10
                                                }));
                                                self.data.push(new_row);
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
                 *  override table_view_click_event  function of parent class: fieldteam.js
                 */                   
                self.table_view_click_event = function(e){
                        try{
                                if(e.row.temp_flag){
                                        var new_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url','job/base/job_history.js'),
                                                type:_type,
                                                job_id:_selected_job_id,
                                                job_contact_history_id:e.row.job_contact_history_id,
                                                company_id:_selected_company_id
                                        });
                                        Titanium.UI.currentTab.open(new_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }
                } ;                      

                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _contact_type_code_array = [];
                var _manager_user_array = [];
        }

        win.addEventListener('focus',function(){
                try{
                        if(job_edit_job_history_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_edit_job_history_page.prototype = new F();
                                job_edit_job_history_page.prototype.constructor = job_edit_job_history_page;
                                job_edit_job_history_page_obj = new job_edit_job_history_page();
                                //call parent class's function: init
                                job_edit_job_history_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_edit_job_history_page_obj.close_window();
                        job_edit_job_history_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                        
        });
}());


