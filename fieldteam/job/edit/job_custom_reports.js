//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_edit_job_custom_report_page_obj = null;

        function job_edit_job_custom_report_page(){
                var self = this;
                var window_source = 'job_edit_job_custom_report_page';
                win.title = 'Reports';

                //public method
                /**
                 *  override init  function of parent class: fieldteam.js
                 */                        
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Add','Main,Back');     
                                self.init_vars();
                                _init_bottom_tool_bar();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                self.table_view.bottom = self.default_table_view_row_height;
                                //call init_no_result_label function of parent class: fieldteam.js
                                self.init_no_result_label();
                                
                                _cancel_button = Titanium.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.CANCEL
                                });
                                _cancel_button.addEventListener('click', function(){
                                        win.setRightNavButton(self.nav_right_btn);
                                        self.table_view.editing = false;
                                        self.bottom_tool_bar.visible = true;
                                }); 
                                self.table_view.addEventListener('delete',function(e){
                                        _event_for_delete_btn(e);
                                });                                
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
                                var rows = db.execute('SELECT * FROM my_custom_report');
                                if(rows != null){
                                        while(rows.isValidRow()){
                                                temp_var = {
                                                        id:rows.fieldByName('id'),
                                                        name:rows.fieldByName('title')
                                                };
                                                _custom_report_array.push(temp_var);
                                                rows.next();
                                        }
                                        rows.close();
                                }
                                
                                var manage_user_array = [];
                                rows = db.execute('SELECT * FROM my_manager_user WHERE company_id=?',_selected_company_id);
                                if(rows != null){
                                        while(rows.isValidRow()){
                                                temp_var = {
                                                        id:rows.fieldByName('id'),
                                                        name:rows.fieldByName('display_name')
                                                };
                                                manage_user_array.push(temp_var);
                                                rows.next();
                                        }
                                        rows.close();
                                }                                
                                
                                rows = db.execute('SELECT * FROM my_'+_type+'_custom_report_data WHERE status_code=1 and '+_type+'_id=? ORDER BY id desc',_selected_job_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var new_text = '';
                                                var temp_flag = 0;
                                                var temp_custom_report_title = '';
                                                if(_custom_report_array.length > 0){
                                                        for(var i=0,j=_custom_report_array.length;i<j;i++){
                                                                if(_custom_report_array[i].id == rows.fieldByName('custom_report_id')){
                                                                        temp_flag = 1;
                                                                        new_text+='Type : '+_custom_report_array[i].name+'\n';
                                                                        temp_custom_report_title  = _custom_report_array[i].name;
                                                                        break;
                                                                }
                                                        }
                                                        if(!temp_flag){
                                                                new_text+='Type : Unknown'+'\n';
                                                        }
                                                }else{
                                                        new_text+='Type : Unknown'+'\n';
                                                }  
                                                
                                                //display manager user name
                                                temp_flag = 0;
                                                if(manage_user_array.length > 0){
                                                        for(i=0,j=manage_user_array.length;i<j;i++){
                                                                if(manage_user_array[i].id == rows.fieldByName('manager_user_id')){
                                                                        temp_flag = 1;
                                                                        new_text+='Author : '+manage_user_array[i].name+'\n';
                                                                        break;
                                                                }
                                                        }
                                                        if(!temp_flag){
                                                                new_text+='Author : Unknown'+'\n';
                                                        }
                                                }else{
                                                        new_text+='Author : Unknown'+'\n';
                                                }                                                
                                                
                                                //created time
                                                new_text+='Date : '+self.display_time_and_date(self.get_seconds_value_by_time_string(rows.fieldByName('created')))+'\n';
                                                
                                                var new_row = Ti.UI.createTableViewRow({
                                                        className:'data_row_'+b,
                                                        filter_class:'job_custom_report',
                                                        hasChild:true,
                                                        height:'auto',
                                                        job_id:rows.fieldByName(_type+'_id'),
                                                        path:rows.fieldByName('path'),
                                                        job_custom_report_data_id:rows.fieldByName('id'),
                                                        custom_report_id:rows.fieldByName('custom_report_id'),
                                                        custom_report_title:temp_custom_report_title,
                                                        manager_user_id:rows.fieldByName('manager_user_id')
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
                 *  display result list
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
                /**
                 *  override event_for_table_view_click  function of parent class: fieldteam.js
                 */                       
                self.table_view_click_event = function(e){
                        try{                                
                                if((e.row.job_custom_report_data_id > 0) && (e.row.job_custom_report_data_id < 1000000000)){                                       
                                        //display job invoice
                                        var invoice_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url','job/base/job_display_custom_report.js'),
                                                type:_type,
                                                job_id:_selected_job_id,
                                                job_reference_number:_selected_job_reference_number,
                                                path:e.row.path,
                                                job_custom_report_data_id:e.row.job_custom_report_data_id,
                                                action_for_invoice:'edit_job_custom_report'
                                        });
                                        Titanium.UI.currentTab.open(invoice_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });                                
                                }else{//reedit report
                                        var custom_report_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url','job/base/job_custom_report.js'),
                                                type:_type,
                                                job_id:_selected_job_id,
                                                job_reference_number:_selected_job_reference_number,
                                                job_custom_report_data_id:e.row.job_custom_report_data_id,
                                                custom_report_id:e.row.custom_report_id,
                                                custom_report_title:e.row.custom_report_title,
                                                manager_user_id:_selected_user_id,
                                                action_for_custom_report:'edit_job_custom_report'
                                        });
                                        Titanium.UI.currentTab.open(custom_report_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });                                           
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }    
                };
                /**
                 *  override nav_right_btn_click_event  function of parent class: fieldteam.js
                 */                       
                self.nav_right_btn_click_event = function(e){
                        try{           
                                _get_custom_report_type_array();
                                if(_custom_report_id_array.length > 0){
                                        _custom_report_id_array.push(-1);
                                        _custom_report_title_array.push('Cancel');
                                        if(self.is_ipad()){
                                                _custom_report_title_array.push('');
                                        }
                                        var optionDialog = Ti.UI.createOptionDialog({
                                                options:_custom_report_title_array,
                                                buttonNames:['Cancel'],
                                                destructive:0,
                                                cancel:self.is_ipad()?_custom_report_title_array.length-2:_custom_report_title_array.length-1,
                                                title:'Please select custom report type.'
                                        });
                                        optionDialog.show();
                                        optionDialog.addEventListener('click',function(evt){
                                                if((evt.index === _custom_report_id_array.length-1)){
                                                }else{
                                                        var custom_report_win = Ti.UI.createWindow({
                                                                url:self.get_file_path('url','job/base/job_custom_report.js'),
                                                                type:_type,
                                                                job_id:_selected_job_id,
                                                                job_reference_number:_selected_job_reference_number,
                                                                job_custom_report_data_id:0,
                                                                custom_report_id:_custom_report_id_array[evt.index],
                                                                custom_report_title:_custom_report_title_array[evt.index],
                                                                manager_user_id:_selected_user_id,
                                                                action_for_custom_report:'add_job_custom_report'
                                                        });
                                                        Titanium.UI.currentTab.open(custom_report_win,{
                                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                        });    
                                                }
                                        });
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }                              
                };                    
                
                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _cancel_button = null;
                var _custom_report_array = [];
                var _custom_report_title_array = [];
                var _custom_report_id_array = [];
                //private method    
                
                function _init_bottom_tool_bar(){
                        try{
                                var flexSpace = Titanium.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
                                });                                
                                //add action button
                                self.trash_button = Ti.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.TRASH 
                                });
                                                                
                                self.bottom_tool_bar = Ti.UI.iOS.createToolbar({
                                        items:[flexSpace,self.trash_button,flexSpace],
                                        bottom:0,
                                        borderColor:self.tool_bar_color_in_ios_7,
                                        borderWidth:1,
                                        zIndex:100
                                });
                                win.add(self.bottom_tool_bar);

                                self.trash_button.addEventListener('click',function(e){
                                        win.setRightNavButton(_cancel_button);
                                        self.table_view.editing = true;
                                        self.bottom_tool_bar.visible = false;
                                        self.table_view.bottom = 0;
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_bottom_tool_bar');
                                return;
                        }
                }                               
                /**
                 *  delete material item and file
                 */                  
                function _event_for_delete_btn(e){
                        try{
                                var job_custom_report_data_id = e.row.job_custom_report_data_id;
                                var db = Titanium.Database.open(self.get_db_name());
                                if(job_custom_report_data_id > 1000000000){
                                        db.execute('DELETE FROM my_'+_type+'_custom_report_data WHERE id=?',job_custom_report_data_id);
                                }else{
                                        db.execute('UPDATE my_'+_type+'_custom_report_data SET changed=?,status_code=?  WHERE id='+job_custom_report_data_id,
                                                1,2
                                                );
                                }
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_delete_btn');
                                return;
                        }  
                }
                /**
                 *  get custom report array
                 */
                function _get_custom_report_type_array(){
                        try{
                                _custom_report_id_array = [];
                                _custom_report_title_array = [];
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_custom_report where status_code=1 and company_id=? order by id desc',_selected_company_id);
                                if(rows != null){
                                        while(rows.isValidRow()){
                                                _custom_report_id_array.push(rows.fieldByName('id'));
                                                _custom_report_title_array.push(rows.fieldByName('title'));
                                                rows.next();
                                        }
                                        rows.close();
                                }
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_custom_report_type_array');
                                return;                                
                        }
                }
        }

        win.addEventListener('focus',function(){
                try{
                        if(job_edit_job_custom_report_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_edit_job_custom_report_page.prototype = new F();
                                job_edit_job_custom_report_page.prototype.constructor = job_edit_job_custom_report_page;
                                job_edit_job_custom_report_page_obj = new job_edit_job_custom_report_page();
                                job_edit_job_custom_report_page_obj.init();
                        }else{
                                job_edit_job_custom_report_page_obj.display();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_edit_job_custom_report_page_obj.close_window();
                        job_edit_job_custom_report_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });   
}());


