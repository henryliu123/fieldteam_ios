(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Ti.UI.currentWindow;
        var action_contact_source_contact_list_page_obj = null;

        function action_contact_source_contact_list_page(){
                var self = this;
                var window_source = 'action_contact_source_contact_list_page';
                win.title = 'Contact List';

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                 
                self.init = function(){
                        try{  
                                self.init_auto_release_pool(win);
                                self.data = [];
                                self.init_navigation_bar('Done','Main,Back');
                                _init_recipients();
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
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                     
                self.nav_right_btn_click_event = function(e){
                        try{
                                _recipients = [];
                                var error_info = [];
                                var invalid_info  = [];
                                var tmp_var = null;
                                var temp_content_text = 'N/A';
                                for(var i=0,j=self.data.length;i<j;i++){
                                        switch(_source){
                                                case 'email':
                                                        temp_content_text = self.data[i].email;
                                                        break;
                                                case 'sms':
                                                        temp_content_text = self.data[i].mobile;
                                                        break;
                                                case 'push':
                                                        temp_content_text = self.data[i].token;
                                                        break;
                                        }                                          
                                        if(self.data[i].hasCheck){
                                                switch(self.data[i].filter_class){
                                                        case 'client':
                                                                tmp_var = {
                                                                        content:temp_content_text,
                                                                        name:self.data[i].name,
                                                                        source:'client',
                                                                        source_id:self.data[i].client_id
                                                                };
                                                                if(self.data[i].client_id > 1000000000){
                                                                        error_info.push(tmp_var);
                                                                }else{
                                                                        if(self.trim(temp_content_text) == ''){
                                                                                invalid_info.push(tmp_var);
                                                                        }else{
                                                                                _recipients.push(tmp_var);
                                                                        }
                                                                }
                                                                break;                                                        
                                                        case 'client_contact':
                                                                tmp_var = {
                                                                        content:temp_content_text,
                                                                        name:self.data[i].name,
                                                                        source:'client_contact',
                                                                        source_id:self.data[i].contact_id
                                                                };
                                                                if(self.data[i].contact_id > 1000000000){
                                                                        error_info.push(tmp_var);
                                                                }else{
                                                                        if(self.trim(temp_content_text) == ''){
                                                                                invalid_info.push(tmp_var);
                                                                        }else{                                                                       
                                                                                _recipients.push(tmp_var);
                                                                        }
                                                                }
                                                                break;
                                                        case 'site_contact':
                                                                tmp_var = {
                                                                        content:temp_content_text,
                                                                        name:self.data[i].name,
                                                                        source:'site_contact',
                                                                        source_id:self.data[i].contact_id
                                                                };
                                                                if(self.data[i].contact_id > 1000000000){
                                                                        error_info.push(tmp_var);
                                                                }else{
                                                                        if(self.trim(temp_content_text) == ''){
                                                                                invalid_info.push(tmp_var);
                                                                        }else{                                                                     
                                                                                _recipients.push(tmp_var);
                                                                        }
                                                                }
                                                                break;
                                                        case 'manager_user':
                                                                tmp_var = {
                                                                        content:temp_content_text,
                                                                        name:self.data[i].name,
                                                                        source:'user',
                                                                        source_id:self.data[i].contact_id
                                                                };
                                                                if(self.data[i].contact_id > 1000000000){
                                                                        error_info.push(tmp_var);
                                                                }else{
                                                                        if(self.trim(temp_content_text) == ''){
                                                                                invalid_info.push(tmp_var);
                                                                        }else{                                                                        
                                                                                _recipients.push(tmp_var);
                                                                        }
                                                                }
                                                                break;
                                                }
                                        }
                                }
                                if(error_info.length > 0){
                                        var error_info_string = '';
                                        for(i=0,j=error_info.length;i<j;i++){
                                                error_info_string+=error_info[i].name;
                                                if(i < (error_info.length-1)){
                                                        error_info_string +='\n';
                                                }
                                        }
                                        self.show_message('The following contacts haven\'t been saved, you can\'t send '+_source+' to them.\n'+error_info_string);
                                        return;
                                }
                                if(invalid_info.length > 0){
                                        error_info_string = '';
                                        for(i=0,j=invalid_info.length;i<j;i++){
                                                error_info_string+=invalid_info[i].name;
                                                if(i < (invalid_info.length-1)){
                                                        error_info_string +='\n';
                                                }                                                
                                        }
                                        self.show_message('The following contacts\'s '+((_source == 'sms')?'phone number':_source)+' are invalid.\n'+error_info_string);
                                        return;                                        
                                }
                                Ti.App.Properties.setString('action_recipients_string',JSON.stringify(_recipients));
                                Ti.App.Properties.setBool('load_recipients',true);       
                                win.close();                           
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
                                if(e.row.hasCheck){
                                        e.row.hasCheck = false;
                                }else{
                                        e.row.hasCheck = true;
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
                var _selected_job_id = win.job_id;
                var _recipients = JSON.parse(win.recipients);
                var _client_id_array = [];
                var _client_contact_id_array = [];
                var _site_contact_id_array = [];
                var _staff_contact_id_array = [];                

                //private method
                /**
                 *  init recipients field for sms, email and notification form
                 */
                function _init_recipients(){
                        try{
                                for(var i=0,j=_recipients.length;i<j;i++){
                                        switch(_recipients[i].source){
                                                case 'client':
                                                        _client_id_array.push(_recipients[i].source_id);
                                                        break;
                                                case 'client_contact':
                                                        _client_contact_id_array.push(_recipients[i].source_id);
                                                        break;
                                                case 'site_contact':
                                                        _site_contact_id_array.push(_recipients[i].source_id);
                                                        break;
                                                case 'user':
                                                        _staff_contact_id_array.push(_recipients[i].source_id);
                                                        break;
                                        }
                                }

                                switch(_source){
                                        case 'sms':
                                                _get_client_list();
                                                _get_client_contacts_list();
                                                _get_site_contacts_list();
                                                _get_manager_users_list();
                                                break;
                                        case 'push':
                                                _get_manager_users_list();
                                                break;
                                        case 'email':
                                                _get_client_list();
                                                _get_client_contacts_list();
                                                _get_manager_users_list();
                                                break;
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_recipients');
                                return;
                        }                        
                }
                /**
                 *  get client list
                 */
                function _get_client_list(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_client WHERE id in ('+
                                        'select a.client_id from my_'+_type+' as a where a.id=?)',_selected_job_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var selected_flag = false;
                                                for(var i=0,j=_client_id_array.length;i<j;i++){
                                                        if(_client_id_array[i] == rows.fieldByName('id')){
                                                                selected_flag = true;
                                                                break;
                                                        }
                                                }
                                                var row = Ti.UI.createTableViewRow({
                                                        filter_class:'client',
                                                        className:'client_list_data_row_'+b,
                                                        hasCheck:(selected_flag)?true:false,
                                                        source:_source,
                                                        job_id:_selected_job_id,
                                                        client_id:rows.fieldByName('id'),
                                                        name:rows.fieldByName('client_name'),
                                                        mobile:((rows.fieldByName('phone_mobile')===undefined)||(rows.fieldByName('phone_mobile')===null))?'':rows.fieldByName('phone_mobile'),
                                                        email:((rows.fieldByName('email') === undefined)||(rows.fieldByName('email') === null))?'':rows.fieldByName('email')
                                                });                                         
                                                if(b === 0){
                                                        row.header = 'Client';
                                                }
                                                var title_label = Ti.UI.createLabel({
                                                        top:5,
                                                        left:10,
                                                        width:self.screen_width-30,
                                                        text:rows.fieldByName('client_name'),
                                                        height:20,
                                                        font:{
                                                                fontSize:self.normal_font_size,
                                                                fontWeight:self.font_weight
                                                        }
                                                });
                                                row.add(title_label);
                                                var content_text = 'N/A';
                                                switch(_source){
                                                        case 'email':
                                                                if((rows.fieldByName('email') != undefined) && (rows.fieldByName('email') != null) && (rows.fieldByName('email') != '')){
                                                                        content_text = rows.fieldByName('email');
                                                                }                                                
                                                                break;
                                                        case 'sms':
                                                                if((rows.fieldByName('phone_mobile') != undefined) && (rows.fieldByName('phone_mobile') != null) && (rows.fieldByName('phone_mobile') != '')){
                                                                        content_text = rows.fieldByName('phone_mobile');
                                                                }                                                
                                                                break;
                                                }
                                                var content_label = Ti.UI.createLabel({
                                                        bottom:3,
                                                        left:10,
                                                        width:self.screen_width-30,
                                                        text:content_text,
                                                        height:20,
                                                        font:{
                                                                fontSize:self.small_font_size
                                                        }
                                                });
                                                row.add(content_label);
                                                self.data.push(row);
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_client_list');
                                return;
                        }
                }                
                /**
                 *  get client contacts list
                 */
                function _get_client_contacts_list(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_client_contact WHERE status_code=1 and client_id in ('+
                                        'select a.client_id from my_'+_type+' as a where a.id=?) and '+
                                        'id in (select b.client_contact_id from my_'+_type+'_client_contact as b where b.'+_type+'_id=? and b.status_code=1)',_selected_job_id,_selected_job_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var selected_flag = false;
                                                for(var i=0,j=_client_contact_id_array.length;i<j;i++){
                                                        if(_client_contact_id_array[i] == rows.fieldByName('id')){
                                                                selected_flag = true;
                                                                break;
                                                        }
                                                }
                                                var row = Ti.UI.createTableViewRow({
                                                        filter_class:'client_contact',
                                                        className:'client_contact_list_data_row_'+b,
                                                        hasCheck:(selected_flag)?true:false,
                                                        source:_source,
                                                        job_id:_selected_job_id,
                                                        contact_id:rows.fieldByName('id'),
                                                        name:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                        mobile:((rows.fieldByName('phone_mobile')===undefined)||(rows.fieldByName('phone_mobile')===null))?'':rows.fieldByName('phone_mobile'),
                                                        email:((rows.fieldByName('email') === undefined)||(rows.fieldByName('email') === null))?'':rows.fieldByName('email')
                                                });                                         
                                                if(b === 0){
                                                        row.header = 'Client Contacts';
                                                }
                                                var title_label = Ti.UI.createLabel({
                                                        top:5,
                                                        left:10,
                                                        width:self.screen_width-30,
                                                        text:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                        height:20,
                                                        font:{
                                                                fontSize:self.normal_font_size,
                                                                fontWeight:self.font_weight
                                                        }
                                                });
                                                row.add(title_label);
                                                var content_text = 'N/A';
                                                switch(_source){
                                                        case 'email':
                                                                if((rows.fieldByName('email') != undefined) && (rows.fieldByName('email') != null) && (rows.fieldByName('email') != '')){
                                                                        content_text = rows.fieldByName('email');
                                                                }                                                
                                                                break;
                                                        case 'sms':
                                                                if((rows.fieldByName('phone_mobile') != undefined) && (rows.fieldByName('phone_mobile') != null) && (rows.fieldByName('phone_mobile') != '')){
                                                                        content_text = rows.fieldByName('phone_mobile');
                                                                }                                                
                                                                break;
                                                }
                                                var content_label = Ti.UI.createLabel({
                                                        bottom:3,
                                                        left:10,
                                                        width:self.screen_width-30,
                                                        text:content_text,
                                                        height:20,
                                                        font:{
                                                                fontSize:self.small_font_size
                                                        }
                                                });
                                                row.add(content_label);
                                                self.data.push(row);
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_client_contacts_list');
                                return;
                        }
                }
                /**
                 *  get site contact list
                 */
                function _get_site_contacts_list(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_'+_type+'_site_contact WHERE status_code=1 and '+_type+'_id=?',_selected_job_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var selected_flag = false;
                                                for(var i=0,j=_site_contact_id_array.length;i<j;i++){
                                                        if(_site_contact_id_array[i] === rows.fieldByName('id')){
                                                                selected_flag = true;
                                                                break;
                                                        }
                                                }
                                                var row = Ti.UI.createTableViewRow({
                                                        filter_class:'site_contact',
                                                        className:'site_contact_list_data_row_'+b,
                                                        hasCheck:(selected_flag)?true:false,
                                                        source:_source,
                                                        job_id:_selected_job_id,
                                                        contact_id:rows.fieldByName('id'),
                                                        name:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                        mobile:((rows.fieldByName('phone_mobile')===undefined)||(rows.fieldByName('phone_mobile')===null))?'':rows.fieldByName('phone_mobile'),
                                                        email:((rows.fieldByName('email') === undefined)||(rows.fieldByName('email') === null))?'':rows.fieldByName('email')
                                                });                                          
                                                if(b === 0){
                                                        row.header = 'Site Contacts'; 
                                                }
                                                var title_label = Ti.UI.createLabel({
                                                        top:5,
                                                        left:10,
                                                        width:self.screen_width-30,
                                                        text:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                        height:20,
                                                        font:{
                                                                fontSize:self.normal_font_size,
                                                                fontWeight:self.font_weight
                                                        }
                                                });
                                                row.add(title_label);
                                                var content_text = 'N/A';
                                                switch(_source){
                                                        case 'email':
                                                                if((rows.fieldByName('email') != undefined) && (rows.fieldByName('email') != null) && (rows.fieldByName('email') != '')){
                                                                        content_text = rows.fieldByName('email');
                                                                }                                                
                                                                break;
                                                        case 'sms':
                                                                if((rows.fieldByName('phone_mobile') != undefined) && (rows.fieldByName('phone_mobile') != null) && (rows.fieldByName('phone_mobile') != '')){
                                                                        content_text = rows.fieldByName('phone_mobile');
                                                                }                                                
                                                                break;
                                                }
                                                var content_label = Ti.UI.createLabel({
                                                        bottom:3,
                                                        left:10,
                                                        width:self.screen_width-30,
                                                        text:content_text,
                                                        height:20,
                                                        font:{
                                                                fontSize:self.small_font_size
                                                        }
                                                });
                                                row.add(content_label);
                                                self.data.push(row);
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_site_contacts_list');
                                return;
                        }
                }
                /**
                 *  get manager user list
                 */
                function _get_manager_users_list(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_manager_user WHERE status_code=1 and company_id=?',_selected_company_id);
                                var b = 0;
                                var row = null;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var selected_flag = false;
                                                for(var i=0,j=_staff_contact_id_array.length;i<j;i++){
                                                        if(_staff_contact_id_array[i] === rows.fieldByName('id')){
                                                                selected_flag = true;
                                                                break;
                                                        }
                                                }
                                                row = Ti.UI.createTableViewRow({
                                                        filter_class:'manager_user',
                                                        className:'manager_user_list_data_row_'+b,
                                                        hasCheck:(selected_flag)?true:false,
                                                        source:_source,
                                                        job_id:_selected_job_id,
                                                        contact_id:rows.fieldByName('id'),
                                                        name:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                        mobile:((rows.fieldByName('phone_mobile')===undefined)||(rows.fieldByName('phone_mobile')===null))?'':rows.fieldByName('phone_mobile'),
                                                        email:((rows.fieldByName('email') === undefined)||(rows.fieldByName('email') === null))?'':rows.fieldByName('email'),
                                                        token:((rows.fieldByName('token') === undefined)||(rows.fieldByName('token') === null))?'':rows.fieldByName('token')
                                                });                                        
                                                if(b === 0){
                                                        row.header = 'Staff';
                                                }
                                                var title_label = Ti.UI.createLabel({
                                                        top:5,
                                                        left:10,
                                                        width:self.screen_width-30,
                                                        text:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                        height:20,
                                                        font:{
                                                                fontSize:self.normal_font_size,
                                                                fontWeight:self.font_weight
                                                        }
                                                });
                                                row.add(title_label);
                                                var content_text = 'N/A';
                                                switch(_source){
                                                        case 'email':
                                                                if((rows.fieldByName('email') != undefined) && (rows.fieldByName('email') != null) && (rows.fieldByName('email') != '')){
                                                                        content_text = rows.fieldByName('email');
                                                                }                                                
                                                                break;
                                                        case 'sms':
                                                                if((rows.fieldByName('phone_mobile') != undefined) && (rows.fieldByName('phone_mobile') != null) && (rows.fieldByName('phone_mobile') != '')){
                                                                        content_text = rows.fieldByName('phone_mobile');
                                                                }                                                
                                                                break;
                                                        case 'push':
                                                                if((rows.fieldByName('token') != undefined)  && (rows.fieldByName('token') != null) && (rows.fieldByName('token') != '')){
                                                                        content_text = rows.fieldByName('token');
                                                                }                                                   
                                                                break;
                                                }
                                                var content_label = Ti.UI.createLabel({
                                                        bottom:3,
                                                        left:10,
                                                        width:self.screen_width-30,
                                                        text:content_text,
                                                        height:20,
                                                        font:{
                                                                fontSize:self.small_font_size
                                                        }
                                                });
                                                row.add(content_label);
                                                self.data.push(row);
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_manager_users_list');
                                return;
                        }
                }
                /**
                 *  get phonebook contacts list
                 */
                function _get_phone_book_list(){
                        try{
                                var people = Titanium.Contacts.getAllPeople();
                                for(var i=0;i<people.length;i++){
                                        var title = people[i].fullName;
                                        if (!title || title.length == 0) {
                                                title = "(No Name)";
                                        }

                                        var row = Ti.UI.createTableViewRow({
                                                className:'phone_book_list_data_row_'+i,
                                                hasChild:true,
                                                source:_source,
                                                job_id:_selected_job_id,
                                                contact_id:0,
                                                contact_name:title,
                                                person:people[i]
                                        });
                                        var title_field = Ti.UI.createLabel({
                                                text:title,
                                                color:self.font_color,
                                                font:{
                                                        fontSize:self.font_size,
                                                        fontWeight:self.font_weight
                                                },
                                                left:10
                                        });
                                        row.add(title_field);
                                        self.data.push(row);
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_phone_book_list');
                                return;
                        }                                
                }
        }

        win.addEventListener('open',function(){
                try{
                        Ti.App.Properties.setBool('load_recipients',false);  
                        if(action_contact_source_contact_list_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                action_contact_source_contact_list_page.prototype = new F();
                                action_contact_source_contact_list_page.prototype.constructor = action_contact_source_contact_list_page;
                                action_contact_source_contact_list_page_obj = new action_contact_source_contact_list_page();
                                action_contact_source_contact_list_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{                        
                        action_contact_source_contact_list_page_obj.close_window();  
                        action_contact_source_contact_list_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());

