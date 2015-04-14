//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_edit_client_contact_page_obj = null;

        function job_edit_client_contact_page(){
                var self = this;
                var window_source = 'job_edit_client_contact_page';
                win.title = self.ucfirst(win.type)+' Client Contacts';

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
                                var db = Titanium.Database.open(self.get_db_name());
                                //assigned user list
                                var contactObj = db.execute('SELECT * FROM my_'+_type+'_client_contact WHERE '+_type+'_id=? and status_code=1 and '+
                                        'client_contact_id in (SELECT a.id FROM my_client_contact as a WHERE a.client_id=?) order by id desc',_selected_job_id,_client_id);
                                var b = 0;
                                if(contactObj.getRowCount() > 0){
                                        while(contactObj.isValidRow()){
                                                var type_name_text = '';
                                                var temp_row = db.execute('SELECT * FROM my_client_contact WHERE id=?',contactObj.fieldByName('client_contact_id'));
                                                if((temp_row.getRowCount() > 0) && (temp_row.isValidRow())){
                                                        type_name_text += 'Name : '+temp_row.fieldByName('first_name')+' '+temp_row.fieldByName('last_name')+'\n';
                                                        type_name_text += 'Position : '+((temp_row.fieldByName('position') === null)?'':temp_row.fieldByName('position'))+'\n';
                                                        type_name_text += 'Mobile : '+((temp_row.fieldByName('phone_mobile') === null)?'':temp_row.fieldByName('phone_mobile'))+'\n';
                                                        type_name_text += 'Phone : '+((temp_row.fieldByName('phone') === null)?'':temp_row.fieldByName('phone'))+'\n';
                                                        type_name_text += 'Fax : '+((temp_row.fieldByName('fax') === null)?'':temp_row.fieldByName('fax'))+'\n';
                                                        type_name_text += 'Email : '+((temp_row.fieldByName('email') === null)?'':temp_row.fieldByName('email'))+'\n';
                                                        type_name_text += 'Note : '+((contactObj.fieldByName('note')=== null)?'':contactObj.fieldByName('note'))+'\n';

                                                        var new_row = Ti.UI.createTableViewRow({
                                                                className:'data_row_'+b,
                                                                filter_class:'job_client_contact',
                                                                height:'auto',
                                                                hasChild:true,
                                                                job_id:_selected_job_id,
                                                                job_client_contact_id:contactObj.fieldByName('id'),
                                                                client_contact_id:contactObj.fieldByName('client_contact_id'),
                                                                client_id:_client_id
                                                        });
                                                        new_row.add(Ti.UI.createLabel({
                                                                text:type_name_text,
                                                                textAlign:'left',
                                                                height:'auto',
                                                                width:'auto',
                                                                left:10,
                                                                top:10,
                                                                bottom:10
                                                        }));
                                                        self.data.push(new_row);
                                                }
                                                contactObj.next();
                                                b++;
                                        }
                                }
                                contactObj.close();
                                db.close();                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }
                };
                /**
                 *  override nav_right_btn_click_event  function of parent class: fieldteam.js
                 */                    
                self.nav_right_btn_click_event = function(e){
                        try{
                                if(_client_id === 0){
                                        self.show_message(L('message_select_client_in_job_client_contacts'));
                                        return;
                                }
                                var existed_client_contact_id_array = [];
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_'+_type+'_client_contact WHERE '+_type+'_id=? and status_code=1',_selected_job_id);
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                if((rows.fieldByName('client_contact_id') != null)&&(rows.fieldByName('client_contact_id') > 0)){
                                                        existed_client_contact_id_array.push(rows.fieldByName('client_contact_id'));
                                                }
                                                rows.next();
                                        }
                                }
                                rows.close();
                                db.close();
                                var contact_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'job/base/job_client_contact.js'),
                                        type:_type,
                                        job_id:_selected_job_id,
                                        job_client_contact_id:0,
                                        client_contact_id:0,
                                        client_id:_client_id,
                                        exist_client_contact_id_string:(existed_client_contact_id_array.length>0)?existed_client_contact_id_array.join(','):'',
                                        action_for_client_contact:'add_job_client_contact'
                                });
                                Titanium.UI.currentTab.open(contact_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                }); 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }                                 
                };                
                /**
                 *  override table_view_click_event  function of parent class: fieldteam.js
                 */                    
                self.table_view_click_event = function(e){
                        try{
                                //collect all selected client contact id
                                var existed_client_contact_id_array = [];
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_'+_type+'_client_contact WHERE '+_type+'_id=? and status_code=1 and client_contact_id !=?',_selected_job_id,e.row.client_contact_id);
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                if((rows.fieldByName('client_contact_id') != null)&&(rows.fieldByName('client_contact_id') > 0)){
                                                        existed_client_contact_id_array.push(rows.fieldByName('client_contact_id'));
                                                }
                                                rows.next();
                                        }
                                }
                                rows.close();
                                db.close();
                                var contact_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'job/base/job_client_contact.js'),
                                        type:_type,
                                        job_id:e.row.job_id,
                                        job_client_contact_id:e.row.job_client_contact_id,
                                        client_contact_id:e.row.client_contact_id,
                                        client_id:e.row.client_id,
                                        exist_client_contact_id_string:(existed_client_contact_id_array.length>0)?existed_client_contact_id_array.join(','):'',
                                        action_for_client_contact:'edit_job_client_contact'
                                });
                                Titanium.UI.currentTab.open(contact_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                                 
                };                


                //private member
                var _client_id = 0;
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _action_for_job = win.action_for_job;      
        }
    
        win.addEventListener('focus',function(){      
                try{
                        if(job_edit_client_contact_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_edit_client_contact_page.prototype = new F();
                                job_edit_client_contact_page.prototype.constructor = job_edit_client_contact_page;
                                job_edit_client_contact_page_obj = new job_edit_client_contact_page();
                                job_edit_client_contact_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }                                 
        });

        win.addEventListener('close',function(){
                try{
                        job_edit_client_contact_page_obj.close_window();
                        job_edit_client_contact_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());


