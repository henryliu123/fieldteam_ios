(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_edit_job_status_page_obj = null;

        function job_edit_job_status_page(){
                var self = this;
                var window_source = 'job_edit_job_status_page';
                win.title = 'Status History';
                
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
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                //call init_no_result_label function of parent class: fieldteam.js
                                self.init_no_result_label();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }                        
                };                     
                /**
                 *  override init_vars  function of parent class: fieldteam.js
                 */                       
                self.init_vars = function(){
                        try{
                                var temp_var = {};
                                var db = Titanium.Database.open(self.get_db_name());
                                var row = db.execute('SELECT * FROM my_'+_type+'_status_code');
                                if(row != null){
                                        while(row.isValidRow()){
                                                temp_var = {
                                                        code:row.fieldByName('code'),
                                                        name:row.fieldByName('name')
                                                };
                                                _status_code_array.push(temp_var);
                                                row.next();
                                        }
                                        row.close();
                                }                                
                                
                                temp_var = {};
                                row = db.execute('SELECT * FROM my_manager_user WHERE company_id=?',_selected_company_id);
                                if(row != null){
                                        while(row.isValidRow()){
                                                temp_var = {
                                                        id:row.fieldByName('id'),
                                                        display_name:row.fieldByName('display_name')
                                                };
                                                _manager_user_array.push(temp_var);
                                                row.next();
                                        }
                                        row.close();
                                }   
                                var rows = db.execute('SELECT * FROM my_'+_type+'_status_log WHERE status_code=1 and '+_type+'_id=? ORDER BY id desc',_selected_job_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var new_text = '';
                                                var temp_flag = 0;
                                                if(_status_code_array.length > 0){
                                                        for(var i=0,j=_status_code_array.length;i<j;i++){
                                                                if(_status_code_array[i].code == rows.fieldByName(_type+'_status_code')){
                                                                        temp_flag = 1;
                                                                        new_text+='Status : '+_status_code_array[i].name+'\n';
                                                                        break;
                                                                }
                                                        }
                                                        if(!temp_flag){
                                                                new_text+='Status : Unknown'+'\n';
                                                        }
                                                }else{
                                                        new_text+='Status : Unknown'+'\n';
                                                }  

                                                
                                                temp_flag = 0;
                                                if(_manager_user_array.length > 0){
                                                        for(i=0,j=_manager_user_array.length;i<j;i++){
                                                                if(_manager_user_array[i].id == rows.fieldByName('manager_user_id')){
                                                                        temp_flag = 1;
                                                                        new_text+='User : '+_manager_user_array[i].display_name+'\n';
                                                                        break;
                                                                }
                                                        }
                                                        if(!temp_flag){
                                                                new_text+='User : Unknown'+'\n';
                                                        }
                                                }else{
                                                        new_text+='User : Unknown'+'\n';
                                                }  

                                                
                                                new_text+='Reason : '+(rows.fieldByName('reason')=== null?'N/A':rows.fieldByName('reason'))+'\n';
                                                new_text+='Time : '+(((rows.fieldByName('created') === undefined) || (rows.fieldByName('created') === null))?'N/A':self.display_time_and_date(self.get_seconds_value_by_time_string(rows.fieldByName('created'))))+'\n';
                                                var new_row = Ti.UI.createTableViewRow({
                                                        className:'data_row_'+b,
                                                        hasChild:false,
                                                        height:'auto',
                                                        job_id:rows.fieldByName(_type+'_id'),
                                                        job_status_log_id:rows.fieldByName('id'),
                                                        job_status_code:rows.fieldByName(_type+'_status_code')
                                                });
                                                new_row.add(Ti.UI.createLabel({
                                                        text:new_text,
                                                        textAlign:'left',
                                                        height:'auto',
                                                        width:'auto',
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
                 *  display status log history
                 */
                self.display = function(){
                        try{
                                self.data = [];
                                self.table_view.setData([]);
                                self.init_vars();
                                if(self.data.length > 0){
                                        self.no_result_label.visible = false;
                                }else{
                                        self.no_result_label.visible = true;
                                }
                                self.table_view.setData(self.data,{
                                animationStyle:Titanium.UI.iPhone.RowAnimationStyle.DOWN
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }
                };
                
                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');    
                var _status_code_array = [];
                var _manager_user_array = [];                
        }

        win.addEventListener('open',function(){
                try{
                        if(job_edit_job_status_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_edit_job_status_page.prototype = new F();
                                job_edit_job_status_page.prototype.constructor = job_edit_job_status_page;
                                job_edit_job_status_page_obj = new job_edit_job_status_page();
                                //call parent class's function: init
                                job_edit_job_status_page_obj.init();
                        }else{
                                job_edit_job_status_page_obj.display();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_edit_job_status_page_obj.close_window();
                        job_edit_job_status_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());


