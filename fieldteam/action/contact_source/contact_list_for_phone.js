(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var action_contact_source_contact_list_for_phone_page_obj = null;

        function action_contact_source_contact_list_for_phone_page(){
                var self = this;
                var window_source = 'action_contact_source_contact_list_page';

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */        
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                self.init_navigation_bar('','Main,Back');
                                var db = Titanium.Database.open(self.get_db_name());
                                _get_client_list(db);
                                _get_client_contacts_list(db);
                                _get_site_contacts_list(db);
                                _get_manager_users_list(db);
                                db.close();

                                //call init_table_view function of parent class:fieldteam.js   
                                self.init_table_view();
                                //call init_no_result_label function of parent class:fieldteam.js   
                                self.init_no_result_label();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };               
                /**
                 *  override table_view_click_event function of parent class: fieldteam.js
                 */                      
                self.table_view_click_event = function(e){
                        try{
                                var new_win = null;
                                switch(e.row.filter_class){
                                        case 'client':
                                                new_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url', 'job/edit/job_client_view.js'),
                                                        type:_type,
                                                        client_id:e.row.client_id,
                                                        client_reference_number:e.row.client_reference_number,
                                                        client_type_code:e.row.client_type_code,
                                                        job_id:_selected_job_id,
                                                        job_reference_number:_selected_job_reference_number,
                                                        action_for_client_contact:'view_client',
                                                        parent_win:win
                                                });
                                                Ti.UI.currentTab.open(new_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });
                                                break;                                        
                                        case 'client_contact':
                                                new_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url', 'job/edit/job_client_contact_view.js'),
                                                        type:_type,
                                                        client_contact_id:e.row.contact_id,
                                                        client_id:e.row.client_id,
                                                        job_id:_selected_job_id,
                                                        job_reference_number:_selected_job_reference_number,
                                                        action_for_client_contact:'view_job_client_contact',
                                                        is_no_edit_btn:true
                                                });
                                                Ti.UI.currentTab.open(new_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });
                                                break;
                                        case 'site_contact':
                                                new_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url', 'job/edit/job_site_contact_view.js'),
                                                        type:_type,
                                                        job_id:_selected_job_id,
                                                        job_reference_number:_selected_job_reference_number,
                                                        action_for_site_contact:'view_job_site_contact',
                                                        site_contact_id:e.row.contact_id,
                                                        is_no_edit_btn:true
                                                });
                                                Ti.UI.currentTab.open(new_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });
                                                break;
                                        case 'manager_user':
                                                new_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url', 'job/edit/job_user_view.js'),
                                                        type:_type,
                                                        job_id:_selected_job_id,
                                                        job_reference_number:_selected_job_reference_number,
                                                        action_for_user:'view_job_user',
                                                        manager_user_id:e.row.contact_id,
                                                        is_no_edit_btn:true
                                                });
                                                Ti.UI.currentTab.open(new_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });
                                                break;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                           
                };
                //private memeber
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _type = win.type;
                var _source = win.source;
                var _selected_job_id = win.job_id;//Ti.App.Properties.getString('currentSelectedJobID');
                var _selected_job_reference_number = win.job_reference_number;

                //private method
                /**
                 *  get client contact list
                 */
                function _get_client_list(db){
                        try{                                
                                var rows = db.execute('SELECT * FROM my_client WHERE id in ('+
                                        'select a.client_id from my_'+_type+' as a where a.id=?)',_selected_job_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var row = Ti.UI.createTableViewRow({
                                                        filter_class:'client',
                                                        className:'client_list_data_row_'+b,
                                                        hasChild:true,
                                                        source:_source,
                                                        job_id:_selected_job_id,
                                                        client_id:rows.fieldByName('id'),
                                                        client_reference_number:rows.fieldByName('reference_number'),
                                                        client_type_code:rows.fieldByName('client_type_code'),
                                                        title:rows.fieldByName('client_name'),
                                                        mobile:rows.fieldByName('phone_mobile'),
                                                        email:rows.fieldByName('email')
                                                });                                         
                                                if(b === 0){
                                                        row.header = 'Client';
                                                }
                                                self.data.push(row);
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_client_list');
                                return;
                        }                                
                }                
                /**
                 *  get client contact list
                 */
                function _get_client_contacts_list(db){
                        try{                                
                                var rows = db.execute('SELECT * FROM my_client_contact WHERE status_code=1 and client_id in ('+
                                        'select a.client_id from my_'+_type+' as a where a.id=?) and '+
                                        'id in (select b.client_contact_id from my_'+_type+'_client_contact as b where b.'+_type+'_id=? and b.status_code=1)',_selected_job_id,_selected_job_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var row = Ti.UI.createTableViewRow({
                                                        filter_class:'client_contact',
                                                        className:'client_contact_list_data_row_'+b,
                                                        hasChild:true,
                                                        source:_source,
                                                        job_id:_selected_job_id,
                                                        client_id:rows.fieldByName('client_id'),
                                                        contact_id:rows.fieldByName('id'),
                                                        title:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                        mobile:rows.fieldByName('phone_mobile'),
                                                        email:rows.fieldByName('email')
                                                });                                         
                                                if(b === 0){
                                                        row.header = 'Client Contacts';
                                                }
                                                self.data.push(row);
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_client_contacts_list');
                                return;
                        }                                
                }
                /**
                 *  get site contact list
                 */
                function _get_site_contacts_list(db){
                        try{
                                var rows = db.execute('SELECT * FROM my_'+_type+'_site_contact WHERE status_code=1 and '+_type+'_id=?',_selected_job_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var row = Ti.UI.createTableViewRow({
                                                        filter_class:'site_contact',
                                                        className:'site_contact_list_data_row_'+b,
                                                        hasChild:true,
                                                        source:_source,
                                                        job_id:_selected_job_id,
                                                        contact_id:rows.fieldByName('id'),
                                                        title:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                        mobile:rows.fieldByName('phone_mobile'),
                                                        email:rows.fieldByName('email')
                                                });                                          
                                                if(b === 0){
                                                        row.header = 'Site Contacts';
                                                }
                                                self.data.push(row);
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_site_contacts_list');
                                return;
                        }                                
                }
                /**
                 *  get manager user list
                 */
                function _get_manager_users_list(db){
                        try{
                                var rows = db.execute('SELECT * FROM my_manager_user WHERE status_code=1 and company_id=?',_selected_company_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var row = Ti.UI.createTableViewRow({
                                                        filter_class:'manager_user',
                                                        className:'manager_user_list_data_row_'+b,
                                                        hasChild:true,
                                                        source:_source,
                                                        job_id:_selected_job_id,
                                                        contact_id:rows.fieldByName('id'),
                                                        title:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                        mobile:rows.fieldByName('phone_mobile'),
                                                        email:rows.fieldByName('email')
                                                });                                        
                                                if(b === 0){
                                                        row.header = 'Staff';
                                                }
                                                self.data.push(row);
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_manager_users_list');
                                return;
                        }                                
                }
        }


        win.addEventListener('open',function(){
                try{
                        if(action_contact_source_contact_list_for_phone_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                action_contact_source_contact_list_for_phone_page.prototype = new F();
                                action_contact_source_contact_list_for_phone_page.prototype.constructor = action_contact_source_contact_list_for_phone_page;
                                action_contact_source_contact_list_for_phone_page_obj = new action_contact_source_contact_list_for_phone_page();
                                action_contact_source_contact_list_for_phone_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }                        
        });

        win.addEventListener('close',function(){
                try{
                        action_contact_source_contact_list_for_phone_page_obj.close_window(); 
                        action_contact_source_contact_list_for_phone_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                        
        });
}());

