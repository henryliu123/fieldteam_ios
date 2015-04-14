/*
 * This class is the parent class of my calendar and teamview
 */

Titanium.include('transaction.js');
function calendar_page(){
        var self = this;
        try{                
                self.window_source = 'calendar_page';
                //class member
                self.calendar_scroll_view = null;
                self.name = 'calendar_page';
                self.zIndex= 5;
                self.view_name = 'cal';
                self.current_activate_tabbed_index = 1;
                self.current_activate_view = null;
                self.calendar_year = 0;
                self.calendar_month = 0;
                self.calendar_date = 0;
                self.calendar_day = 0;
                self.scroll_to_height = -1;        
                self.current_job_status_index = -1;
                self.current_quote_status_index = -1;
                self.current_job_status_name = 'All Jobs';
                self.current_quote_status_name = 'All Quotes';
                self.current_selected_calendar_type_in_list = 'job';
                self.switch_tab = false;
                self.existed_job_id_string = '';//save existed job id string
                self.existed_quote_id_string = '';
                self.selected_user_id = Titanium.UI.currentWindow.user_id;
                self.selected_company_id = Titanium.UI.currentWindow.company_id;
                self.pulling = false;
                self.downloading = false;
                self.pull_down_to_update = true;
                self.pull_down_to_download_more = true;            
                self.download_type = 'job';    
                self.my_job_number_on_server = 0;
                self.my_quote_number_on_server = 0;
                self.my_selected_job_number = 0;
                self.my_selected_quote_number = 0;
                self.my_downloaded_job_number = 0;
                self.my_downloaded_quote_number = 0;
                
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - self.init');
                return;
        }
}

//get parent class's prototype object
var FC = function(){};
FC.prototype = transaction_page.prototype;
calendar_page.prototype = new FC();
calendar_page.prototype.constructor = calendar_page;


/**
 * prototype class member
 */
calendar_page.prototype.download_type = '';//job, quote or both
calendar_page.prototype.job_extra_where = '';
calendar_page.prototype.calendar_today_hour_distance = 60;//how big betweeen solid line
calendar_page.prototype.calendar_today_top_distance = 15;//how big between top of calendr and toolbar of calendar instrucation
calendar_page.prototype.calendar_today_job_default_width = Titanium.Platform.displayCaps.platformWidth-80;//default width of job on the calendar
calendar_page.prototype.calendar_today_start_distance = 70;
calendar_page.prototype.calendar_today_left_distance = 70;//the distance with left side
calendar_page.prototype.avg_width = parseFloat(Titanium.Platform.displayCaps.platformWidth/7,10);
calendar_page.prototype.job_status_code_array = [];
calendar_page.prototype.quote_status_code_array = [];
calendar_page.prototype.job_count_of_day_in_selected_month = [];
/**
 *  init event
 */
calendar_page.prototype.init = function(){
        var self = this;
        try{        
                self.init_auto_release_pool(Titanium.UI.currentWindow);
                self.init_navigation_bar('Refresh','Main,Back');
                self.init_vars();
                self.init_controls();
                self.init_load_data_event();
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init');
                return;
        }
};
/**
 *  init navigation bar's right button event
 */
calendar_page.prototype.nav_right_btn_click_event = function(e){ 
        var self = this;
        try{       
                self.update_and_download_data();                
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.nav_right_btn_click_event');
                return;
        }
};

calendar_page.prototype.process_event_before_close_window = function(){
        var self = this;
        try{ 
                //remove calendar data and container
                if((self.calendar_data != undefined) && (self.calendar_data != null) && (self.calendar_data.length > 0)){
                        for(var i=0,j=self.calendar_data.length;i<j;i++){
                                if((self.calendar_data[i] != undefined) && (self.calendar_data[i] != null)){
                                        self.day_scroll_view.remove(self.calendar_data[i]);
                                        self.calendar_data[i] = null;
                                }
                        }                                                 
                }                               
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - process_event_before_close_window');
                return; 
        }                            
};
/**
 *  init variables
 */
calendar_page.prototype.init_vars = function(){
        var self = this;
        try{
                var new_date = new Date();
                self.calendar_year = new_date.getFullYear();
                self.calendar_month = new_date.getMonth();
                self.calendar_date = new_date.getDate();
                self.calendar_day = new_date.getDay();
                
                var temp_var = {};
                var db = Titanium.Database.open(self.get_db_name());
                var job_status_code_rows = db.execute('SELECT * FROM my_job_status_code');
                if(job_status_code_rows != null){
                        while(job_status_code_rows.isValidRow()){
                                temp_var = {
                                        code:job_status_code_rows.fieldByName('code'),
                                        colour:job_status_code_rows.fieldByName('colour'),
                                        name:job_status_code_rows.fieldByName('name'),
                                        description:job_status_code_rows.fieldByName('description')
                                };
                                self.job_status_code_array.push(temp_var);
                                job_status_code_rows.next();
                        }
                        job_status_code_rows.close();
                }
                
                var quote_status_code_rows = db.execute('SELECT * FROM my_quote_status_code');
                if(quote_status_code_rows != null){
                        while(quote_status_code_rows.isValidRow()){
                                temp_var = {
                                        code:quote_status_code_rows.fieldByName('code'),
                                        colour:quote_status_code_rows.fieldByName('colour'),
                                        name:quote_status_code_rows.fieldByName('name'),
                                        description:quote_status_code_rows.fieldByName('description')
                                };
                                self.quote_status_code_array.push(temp_var);
                                quote_status_code_rows.next();
                        }
                        quote_status_code_rows.close();  
                }                              
                db.close();                
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_vars');
                return;
        }
};
/**
 *  init controls for window
 */
calendar_page.prototype.init_controls = function(){
        var self = this;
        try{               
                //bottom toolbar
                self.today_btn_bar = Ti.UI.createButtonBar({
                        labels:['Today'],
                        style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
                        height:30,
                        width:50,
                        left:5
                });

                self.date_btn_bar = Titanium.UI.iOS.createTabbedBar({
                        labels:['List', 'Cal' ,'Day', 'Week','Month' ],
                        style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
                        height:30,
                        width:self.screen_width-80,
                        index:1,
                        right:10
                });

                self.bottom_tool_bar = Ti.UI.iOS.createToolbar({
                        items:[self.today_btn_bar,self.date_btn_bar],
                        bottom:0,
                        borderColor:self.tool_bar_color_in_ios_7,
                        borderWidth:1,
                        zIndex:101
                });                   
                Titanium.UI.currentWindow.add(self.bottom_tool_bar);              
                    
                self.parentView = Ti.UI.createView({
                        height: Ti.UI.FILL,
                        width: Ti.UI.FILL
                });
                Titanium.UI.currentWindow.add(self.parentView);                    
                    
                    
                self.today_btn_bar.addEventListener('click',function(e){
                        self.today_btn_click_event(e);
                });
                
                self.date_btn_bar.addEventListener('click',function(e){
                        self.date_tab_btn_click_event(e);
                });                                
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_controls');
                return;
        }
};
/**
 * set default page is calendar
 * load today's job to calendar
 */
calendar_page.prototype.init_load_data_event = function(){
        var self = this;
        try{
                if(Ti.Network.online){  
                        self.view_name = 'cal';
                        self.update_and_download_data();
                }else{
                        self.show_calendar(true);
                        return;
                }                
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_load_data_event');
                return;
        }
};
/**
 * create pull down view
 */
calendar_page.prototype.init_pull_down_view = function(){
        var self = this;
        try{
                self.pulling = false;
                self.downloading = false;
                self.contentOffset_y = 0;
                var pull_view_border = Ti.UI.createView({
                        backgroundColor:"#576c89",
                        height:2,
                        bottom:0
                });
                var table_view_header = Ti.UI.createView({
                        backgroundColor:self.tool_bar_background_color,
                        width:320,
                        height:60
                });
                // fake it til ya make it..  create a 2 pixel
                // bottom border
                table_view_header.add(pull_view_border);
                var pull_view_arrow = Ti.UI.createView({
                        backgroundImage:self.get_file_path('image','whiteArrow.png'),
                        width:23,
                        height:60,
                        bottom:10,
                        left:20
                });
                var pull_view_status_label = Ti.UI.createLabel({
                        text:"Pull down to download ...",
                        width:self.screen_width,
                        left:30,
                        bottom:45,
                        height:20,
                        color:"#576c89",
                        textAlign:"center",
                        font:{
                                fontSize:12,
                                fontWeight:"bold"
                        }
                });  
                var temp_number_on_server = (self.current_selected_calendar_type_in_list === 'job')?self.my_job_number_on_server:self.my_quote_number_on_server;
                var temp_downloaded_number = (self.current_selected_calendar_type_in_list === 'job')?self.my_downloaded_job_number:self.my_downloaded_quote_number;                
                self.pull_view_job_status_label = Ti.UI.createLabel({
                        text:'Total '+temp_number_on_server+' '+self.ucfirst(self.current_selected_calendar_type_in_list)+((temp_number_on_server>1)?'s':'')+', Downloaded '+temp_downloaded_number+' '+self.ucfirst(self.current_selected_calendar_type_in_list)+((temp_downloaded_number>1)?'s':''),
                        width:self.screen_width,
                        left:30,
                        bottom:25,
                        height:20,
                        color:"#576c89",
                        textAlign:"center",
                        font:{
                                fontSize:12
                        }
                });                  
                var pull_view_last_updated = Ti.UI.createLabel({
                        text:'Last Updated : '+self.get_last_updated_time_text(),
                        left:30,
                        width:self.screen_width,
                        bottom:10,
                        height:12,
                        color:"#576c89",
                        textAlign:"center",
                        font:{
                                fontSize:12
                        }
                });                
                table_view_header.add(pull_view_arrow);
                table_view_header.add(pull_view_status_label);
                table_view_header.add(self.pull_view_job_status_label);
                table_view_header.add(pull_view_last_updated);
                return table_view_header;
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_pull_down_view');
                return null;
        }
};
/**
 * refresh event, reload job or quote list
 */ 
calendar_page.prototype.refresh = function(is_showing){
        var self = this;
        try{
                switch(self.view_name){
                        case 'list':
                                self.show_list(is_showing);
                                break;
                        case 'cal':
                                self.show_calendar(is_showing);
                                break;
                        case 'day':
                                self.show_day(is_showing);
                                break;
                        case 'week':
                                self.show_week(is_showing);
                                break;
                        case 'month':
                                self.show_month(is_showing);
                                break;
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.refresh');
                return;
        }
};
/**
 * date tab button event 
*/
calendar_page.prototype.date_tab_btn_click_event = function(e){
        var self = this;
        try{        
                if(self.current_activate_tabbed_index == e.index){
                        return;
                }
                self.current_activate_tabbed_index = e.index;
                self.pulling = false;
                self.downloading = false;
                switch(e.index){
                        case 0://list
                                self.download_type = self.current_selected_calendar_type_in_list;
                                self.date_tab_btn_event_switch_to_list();
                                break;
                        case 1://calendar
                                self.date_tab_btn_event_switch_to_calendar();
                                break;
                        case 2://day
                                self.date_tab_btn_event_switch_to_day();
                                break;
                        case 3://week
                                self.date_tab_btn_event_switch_to_week();
                                break;
                        case 4://month
                                self.date_tab_btn_event_switch_to_month();
                                break;
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.date_tab_btn_click_event');
                return;
        }
};
calendar_page.prototype.date_tab_btn_event_switch_to_list = function(){
        var self = this;
        self.switch_tab = true;
        try{
                self.display_indicator('Loading Data ...');
                if((self.list_container === undefined)||(self.list_container === null)){
                        self.init_list_container();
                }
                if(self.current_activate_view != null){
                        self.current_activate_view.zIndex = self.list_container.zIndex;
                }               
                self.list_container.zIndex = self.zIndex;                
                self.show_list(false);
                self.switch_tab = false;
                self.parentView.animate({
                        view: self.list_container,
                        transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
                });                 
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.date_tab_btn_event_switch_to_list');
                return;
        }
};
calendar_page.prototype.date_tab_btn_event_switch_to_calendar = function(){
        var self = this;
        self.switch_tab = true;
        try{
                self.display_indicator('Loading Data ...');
                if((self.calendar_container === undefined)||(self.calendar_container === null)){
                        self.init_calendar_container();
                }
                if(self.current_activate_view != null){
                        self.current_activate_view.zIndex = self.calendar_container.zIndex;
                }
                self.calendar_container.zIndex = self.zIndex;
                self.show_calendar(false);
                self.switch_tab = false;
                self.parentView.animate({
                        view: self.calendar_container,
                        transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
                });                 
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.date_tab_btn_event_switch_to_calendar');
                return;
        }
};
calendar_page.prototype.date_tab_btn_event_switch_to_day = function(){
        var self = this;
        self.switch_tab = true;
        try{
                self.display_indicator('Loading Data ...');
                if((self.day_list_container === undefined)||(self.day_list_container === null)){
                        self.init_day_container();
                }
                if(self.current_activate_view != null){
                        self.current_activate_view.zIndex = self.day_list_container.zIndex;
                }
                self.day_list_container.zIndex = self.zIndex;                
                self.show_day(false);
                self.switch_tab = false;
                self.parentView.animate({
                        view: self.day_list_container,
                        transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
                });                 
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.date_tab_btn_event_switch_to_day');
                return;
        }
};
calendar_page.prototype.date_tab_btn_event_switch_to_week = function(){
        var self = this;
        self.switch_tab = true;        
        try{
                self.display_indicator('Loading Data ...');
                if((self.week_container === undefined)||(self.week_container === null)){                  
                        self.init_week_container();
                }                
                if(self.current_activate_view != null){
                        self.current_activate_view.zIndex = self.week_container.zIndex;
                }
                self.week_container.zIndex = self.zIndex;
                
                self.show_week(false);
                self.switch_tab = false;
                self.parentView.animate({
                        view: self.week_container,
                        transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
                });                 
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.date_tab_btn_event_switch_to_week');
                return;
        }
};
calendar_page.prototype.date_tab_btn_event_switch_to_month = function(){
        var self = this;
        self.switch_tab = true;
        try{
                self.display_indicator('Loading Data ...');
                if((self.month_container === undefined)||(self.month_container === null)){
                        self.init_month_container();
                }
                if(self.current_activate_view != null){
                        self.current_activate_view.zIndex = self.month_container.zIndex;
                }
                self.month_container.zIndex = self.zIndex;                
                self.show_month(false);
                self.switch_tab = false; 
                self.parentView.animate({
                        view: self.month_container,
                        transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
                });                 
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.date_tab_btn_event_switch_to_month');
                return;
        }
};
/**
 * today button event
 */
calendar_page.prototype.today_btn_click_event = function(e){
        var self = this;
        try{
                if(e.index === 0){
                        var d = new Date();
                        self.calendar_year = d.getFullYear();
                        self.calendar_month = d.getMonth();
                        self.calendar_date = d.getDate();
                        self.calendar_day = d.getDay();
                        self.refresh(true);
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.today_btn_click_event');
                return;
        }
};
/**
 * event for table view
 */
calendar_page.prototype.table_view_click_event = function(e){
        var self = this;
        try{
                if(e.row.className === 'download_more_jobs_on_bottom'){
                        self.download_more_job_event(false);
                }else{
                        var new_win = Ti.UI.createWindow({
                                type:e.row.job_type,
                                url:self.get_file_path('url','job/edit/job_index_view.js'),
                                action_for_job:'edit_job',
                                job_id:e.row.job_id,
                                job_reference_number:e.row.job_reference_number,
                                job_status_code:e.row.job_status_code
                        });
                        Ti.UI.currentTab.open(new_win,{
                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                        });                        
                }
        }
        catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.table_view_click_event');
                return;
        }
};
calendar_page.prototype.table_view_scroll_event = function(e){
        var self = this;
        try{
                if(self.view_name === 'list'){
                        var temp_number_on_server = (self.current_selected_calendar_type_in_list === 'job')?self.my_job_number_on_server:self.my_quote_number_on_server;
                        var temp_downloaded_number = (self.current_selected_calendar_type_in_list === 'job')?self.my_downloaded_job_number:self.my_downloaded_quote_number;                                 
                        var offset = e.contentOffset.y;                        
                        self.pull_view_job_status_label.text = 'Total '+temp_number_on_server+' '+self.ucfirst(self.current_selected_calendar_type_in_list)+((temp_number_on_server>1)?'s':'')+', Displaying '+temp_downloaded_number+' '+self.ucfirst(self.current_selected_calendar_type_in_list)+((temp_downloaded_number>1)?'s':'');
                        if (offset <= -65.0 && !self.pulling){
                                var t = Ti.UI.create2DMatrix();
                                t = t.rotate(-180);
                                self.pulling = true;
                                self.contentOffset_y = offset;
                                self.list_table_view.headerPullView.children[1].animate({
                                        transform:t,
                                        duration:180
                                }); 
                                self.list_table_view.headerPullView.children[2].text = 'Release to download ...';
                        }                         
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.table_view_scroll_event');
                return;
        }
};
calendar_page.prototype.table_view_scroll_end_event = function(e){
        var self = this;
        try{                
                if (self.pulling && !self.downloading && self.contentOffset_y <= -65.0){
                        self.download_more_job_event(true);
                }
        }catch(err){
                Ti.App.Properties.setBool('lock_table_flag',false);
                self.end_download_more_jobs_by_scroll_down(true);
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.table_view_scroll_end_event');
                return;
        }
};
calendar_page.prototype.download_more_job_event = function(is_display_pull_down_view_area){
        var self = this;
        try{                
                if(Ti.Network.online){
                        self.display_indicator('Loading Data ...');
                        if(self.pull_down_to_update || self.pull_down_to_download_more){ 
                                Ti.App.Properties.setBool('lock_table_flag',true);
                                if(is_display_pull_down_view_area){
                                        self.downloading = true;
                                        self.pulling = false;
                                        self.contentOffset_y = 0;
                                        if(self.view_name === 'list'){
                                                self.list_table_view.headerPullView.children[1].hide();
                                                self.list_table_view.headerPullView.children[2].text = "Downloading...";
                                                self.list_table_view.setContentInsets({
                                                        top:60
                                                },{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });
                                                self.list_table_view.headerPullView.children[1].transform=Ti.UI.create2DMatrix();                                                      
                                        }
                                }
                                self.existed_job_id_string = self.get_existed_job_or_quote_id_string('job',self.selected_company_id);
                                self.existed_quote_id_string = self.get_existed_job_or_quote_id_string('quote',self.selected_company_id);                                  
                                if(self.pull_down_to_update && self.pull_down_to_download_more){                       
                                        self.download_latest_log_and_download_more_jobs();
                                }else{
                                        if(self.pull_down_to_update){
                                                //call latest log and update local database
                                                self.download_latest_log(false);
                                        }
                                        if(self.pull_down_to_download_more){
                                                //download more
                                                self.begin_download_more_jobs_by_scroll_down();                                                
                                        }
                                }
                                Ti.App.Properties.setBool('lock_table_flag',false);
                        }
                }else{
                        Ti.App.Properties.setBool('lock_table_flag',false);
                        self.end_download_more_jobs_by_scroll_down(true);
                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                        return;
                }
        }catch(err){
                Ti.App.Properties.setBool('lock_table_flag',false);
                self.end_download_more_jobs_by_scroll_down(true);
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.download_more_job_event');
                return;
        }
};
/**
 *  display all jobs or quotes which have been assigned to mine
 */
calendar_page.prototype.show_list = function(is_show_loading){
        var self = this;
        try{                
                if(is_show_loading){
                        self.display_indicator('Loading Data ...');
                } 
                self.get_my_job_or_quote_number();
                self.init_list_container();
                self.current_activate_view = self.list_container;
                self.view_name = 'list';
                self.list_data = [];
                self.list_table_view.setData([]);

                //get data
                self.get_data_for_show_list_by_assigned_from_is_null();
                self.get_data_for_show_list_by_assigned_from_is_not_null();

                //set background color for row
                for(var i=0,j=self.list_data.length;i<j;i++){
                        if(i%2 === 0){
                                self.list_data[i].backgroundColor = self.job_list_row_background_color;
                        }else{
                                self.list_data[i].backgroundColor = '#fff';
                        }
                }
                
                self.add_download_more_jobs_row_on_bottom();

                if(self.list_data.length > 0){
                        self.list_no_result_label.visible = false;
                        self.list_table_view.setData(self.list_data);
                }else{
                        self.list_no_result_label.visible = true;
                }
                setTimeout(function(){
                        self.hide_indicator();
                },500);
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.show_list');
                return;
        }
};
calendar_page.prototype.get_data_for_show_list_by_assigned_from_is_null = function(){
        var self = this;
        try{
                var db = Titanium.Database.open(self.get_db_name());
                var rows = null;
                var job_status_code = 0;
                if(self.current_selected_calendar_type_in_list === 'job'){
                        job_status_code = self.current_job_status_index;
                }
                if(self.current_selected_calendar_type_in_list === 'quote'){
                        job_status_code = self.current_quote_status_index;
                }
                //query all job or quote by condition, include user's assigned_from and assigned_to
                var sql_params ={
                        is_task:false,
                        is_calendar:true,//in calendar or in filter
                        is_scheduled:false,//query assigned_from is not null
                        is_check_changed:false,//check changed field or not
                        is_check_self_job:true,//only check current user's job
                        order_by:'my_'+self.current_selected_calendar_type_in_list+'.reference_number desc',
                        is_search:false,
                        search_string:'',
                        extra_left_join_condition:'my_'+self.current_selected_calendar_type_in_list+'_assigned_user.assigned_from is null',
                        extra_where_condition:'',
                        type:self.current_selected_calendar_type_in_list,
                        user_id:self.selected_user_id,
                        company_id:self.selected_company_id,
                        job_status_code:((job_status_code === undefined) ||(job_status_code === null))?-1:job_status_code
                };
                var sql = self.setup_sql_query_for_display_job_list(sql_params);
                rows = db.execute(sql);
                var b = 0;
                if(rows.getRowCount() > 0){
                        while(rows.isValidRow()){
                                var status_colour = '';
                                var status_name = '';
                                var status_description = '';
                                if(self.current_selected_calendar_type_in_list === 'job'){
                                        for(var i=0,j=self.job_status_code_array.length;i<j;i++){
                                                if(self.job_status_code_array[i].code == rows.fieldByName(self.current_selected_calendar_type_in_list+'_status_code')){
                                                        status_colour = self.job_status_code_array[i].colour;
                                                        status_name  = self.job_status_code_array[i].name;
                                                        status_description = self.job_status_code_array[i].description;
                                                        break;
                                                }
                                        }     
                                }else{
                                        for(i=0,j=self.quote_status_code_array.length;i<j;i++){
                                                if(self.quote_status_code_array[i].code == rows.fieldByName(self.current_selected_calendar_type_in_list+'_status_code')){
                                                        status_colour = self.quote_status_code_array[i].colour;
                                                        status_name  = self.quote_status_code_array[i].name;
                                                        status_description = self.quote_status_code_array[i].description;
                                                        break;
                                                }
                                        }                                          
                                }
                                
                                var params = {
                                        is_header:(b===0)?true:false,
                                        header_text:'Not Scheduled',
                                        job_type:self.current_selected_calendar_type_in_list,
                                        job_title:rows.fieldByName('title'),
                                        job_id:rows.fieldByName('id'),
                                        job_reference_number:rows.fieldByName('reference_number'),
                                        job_status_code:rows.fieldByName(self.current_selected_calendar_type_in_list+'_status_code'),
                                        class_name:'show_list_data_row_'+b,
                                        assigned_from_hours:'',
                                        assigned_from_minutes:'',
                                        assigned_to_hours:'',
                                        assigned_to_minutes:'',
                                        job_status_color:status_colour,
                                        job_status_name:status_name,
                                        job_status_description:status_description,
                                        sub_number:rows.fieldByName('sub_number'),
                                        unit_number:rows.fieldByName('unit_number'),
                                        street_number:rows.fieldByName('street_number'),
                                        street:rows.fieldByName('street'),
                                        street_type:rows.fieldByName('street_type'),
                                        suburb:rows.fieldByName('suburb'),
                                        postcode:rows.fieldByName('postcode'),
                                        selected_date_string:''
                                };
                                self.list_data.push(self.setup_job_row_for_job_list(params));
                                b++;
                                rows.next();
                        }
                }
                rows.close();
                db.close();
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.get_data_for_show_list_by_assigned_from_is_null');
                return;
        }
};
calendar_page.prototype.get_data_for_show_list_by_assigned_from_is_not_null = function(){
        var self = this;
        try{
                var job_status_code = 0;
                if(self.current_selected_calendar_type_in_list === 'job'){
                        job_status_code = self.current_job_status_index;
                }
                if(self.current_selected_calendar_type_in_list === 'quote'){
                        job_status_code = self.current_quote_status_index;
                }
                var temp_year = 0;
                var temp_month = 0;
                var temp_date = 0;
                var temp_day = 0;
                var temp_hours = 0;
                var temp_minutes = 0;
                var temp_string = temp_year+'-'+(temp_month+1)+'-'+temp_date;
                var min_value = -1;
                var temp_big_array = [];//save all job with schedlued from
                var temp_sub_array = [];//every day's jobs as a sub array
                var temp_sub_header_array = [];
                var db = Titanium.Database.open(self.get_db_name());
                var sql_params ={
                        is_task:false,
                        is_calendar:true,//in calendar or in filter
                        is_scheduled:true,//query assigned_from is not null
                        is_check_changed:false,//check changed field or not
                        is_check_self_job:true,//only check current user's job
                        order_by:'my_'+self.current_selected_calendar_type_in_list+'_assigned_user.assigned_from desc',
                        is_search:false,
                        extra_left_join_condition:'my_'+self.current_selected_calendar_type_in_list+'_assigned_user.assigned_from is not null',
                        extra_where_condition:'',
                        type:self.current_selected_calendar_type_in_list,
                        user_id:self.selected_user_id,
                        company_id:self.selected_company_id,
                        job_status_code:((job_status_code === undefined) ||(job_status_code === null))?-1:job_status_code
                };
                var sql = self.setup_sql_query_for_display_job_list(sql_params);
                var rows = db.execute(sql);

                var q_row_count = rows.getRowCount();
                var q=0;
                var b = self.list_data.length+1;
                if(rows.getRowCount() > 0){
                        while(rows.isValidRow()){
                                var temp_date_value = self.get_seconds_value_by_time_string(rows.fieldByName('assigned_from'));
                                temp_date_value = new Date(temp_date_value*1000);
                                temp_year = temp_date_value.getFullYear();
                                temp_month = temp_date_value.getMonth()+1;
                                temp_date = temp_date_value.getDate();
                                temp_day = temp_date_value.getDay();
                                temp_hours = temp_date_value.getHours();
                                temp_minutes = temp_date_value.getMinutes();
                                var status_colour = '';
                                var status_name = '';
                                var status_description = '';
                                if(self.current_selected_calendar_type_in_list === 'job'){
                                        for(var i=0,j=self.job_status_code_array.length;i<j;i++){
                                                if(self.job_status_code_array[i].code == rows.fieldByName(self.current_selected_calendar_type_in_list+'_status_code')){
                                                        status_colour = self.job_status_code_array[i].colour;
                                                        status_name  = self.job_status_code_array[i].name;
                                                        status_description = self.job_status_code_array[i].description;
                                                        break;
                                                }
                                        }     
                                }else{
                                        for(i=0,j=self.quote_status_code_array.length;i<j;i++){
                                                if(self.quote_status_code_array[i].code == rows.fieldByName(self.current_selected_calendar_type_in_list+'_status_code')){
                                                        status_colour = self.quote_status_code_array[i].colour;
                                                        status_name  = self.quote_status_code_array[i].name;
                                                        status_description = self.quote_status_code_array[i].description;
                                                        break;
                                                }
                                        }                                          
                                }                                
                                if((temp_year+'-'+temp_month+'-'+temp_date) === temp_string){                               
                                }else{
                                        var cur_date_value = new Date(self.calendar_year,self.calendar_month+1,self.calendar_date);
                                        var row_date_value = new Date(temp_year,temp_month-1,temp_date);
                                        var temp_min_value = cur_date_value - row_date_value;
                                        if(temp_min_value < 0){
                                                temp_min_value = -temp_min_value;
                                        }
                                        if(min_value === -1){
                                                min_value = temp_min_value;
                                        }else{
                                                if(min_value > temp_min_value){
                                                        min_value = temp_min_value;
                                                }
                                        }
                                        temp_string = temp_year+'-'+temp_month+'-'+temp_date;
                                        temp_sub_header_array.push(self.day_list[temp_day]+' '+temp_date+'-'+self.month_list[temp_month-1]+'-'+temp_year);

                                        if(temp_sub_array.length > 0){
                                                temp_sub_array.reverse();
                                                temp_big_array.push(temp_sub_array);
                                        }
                                        temp_sub_array = [];//every day's jobs as a sub array
                                }

                                var assigned_to_hours = '';
                                var assigned_to_minutes = '';
                                if((rows.fieldByName('assigned_to') != undefined) && (rows.fieldByName('assigned_to') != null) && (rows.fieldByName('assigned_to') != '')){
                                        var assigned_to_temp_date_value = self.get_seconds_value_by_time_string(rows.fieldByName('assigned_to'));
                                        assigned_to_temp_date_value = new Date(assigned_to_temp_date_value*1000);
                                        assigned_to_hours = assigned_to_temp_date_value.getHours();
                                        assigned_to_minutes = assigned_to_temp_date_value.getMinutes();
                                }
                                var params = {
                                        is_header:false,
                                        header_text:'',
                                        job_type:self.current_selected_calendar_type_in_list,
                                        job_title:rows.fieldByName('title'),
                                        job_id:rows.fieldByName('id'),
                                        job_reference_number:rows.fieldByName('reference_number'),
                                        job_status_code:rows.fieldByName(self.current_selected_calendar_type_in_list+'_status_code'),
                                        class_name:'show_list_data_row_'+b,
                                        assigned_from_hours:temp_hours,
                                        assigned_from_minutes:temp_minutes,
                                        assigned_to_hours:assigned_to_hours,
                                        assigned_to_minutes:assigned_to_minutes,
                                        job_status_color:status_colour,
                                        job_status_name:status_name,
                                        job_status_description:status_description,
                                        sub_number:rows.fieldByName('sub_number'),
                                        unit_number:rows.fieldByName('unit_number'),
                                        street_number:rows.fieldByName('street_number'),
                                        street:rows.fieldByName('street'),
                                        street_type:rows.fieldByName('street_type'),
                                        suburb:rows.fieldByName('suburb'),
                                        postcode:rows.fieldByName('postcode')
                                }; 
                                temp_sub_array.push(self.setup_job_row_for_job_list(params));
                                if(q+1 === q_row_count){
                                        temp_sub_array.reverse();
                                        temp_big_array.push(temp_sub_array);
                                }
                                //self.list_data.push(row);
                                b++;
                                q++;
                                rows.next();
                        }
                }
                rows.close();
                db.close();
                //load data into array by new order
                for(i=0,j=temp_big_array.length;i<j;i++){
                        for(var m=0,n=temp_big_array[i].length;m<n;m++){
                                if(m === 0){
                                        temp_big_array[i][m].header = temp_sub_header_array[i];
                                }
                                self.list_data.push(temp_big_array[i][m]);
                        }
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.get_data_for_show_list_by_assigned_from_is_not_null');
                return;
        }
};
calendar_page.prototype.add_download_more_jobs_row_on_bottom = function(){
        var self = this;
        try{
                var row = Ti.UI.createTableViewRow({
                        height:'auto',
                        job_type:self.current_selected_calendar_type_in_list,
                        className:'download_more_jobs_on_bottom'
                });                
                
                var download_more_results = Ti.UI.createLabel({
                        text:"Download More Results ...",
                        width:300,
                        top:5,
                        bottom:45,
                        height:20,
                        color:"#576c89",
                        textAlign:"center",
                        font:{
                                fontSize:15,
                                fontWeight:"bold"
                        }
                });        
                row.add(download_more_results);
                
                //status name
                self.selected_status_name_label = Ti.UI.createLabel({
                        text:'('+((self.current_selected_calendar_type_in_list === 'job')?self.current_job_status_name:self.current_quote_status_name)+')',
                        width:300,
                        bottom:25,
                        height:12,
                        color:"#576c89",
                        textAlign:"center",
                        font:{
                                fontSize:12
                        }
                });        
                row.add(self.selected_status_name_label);                
                
                var temp_number_on_server = (self.current_selected_calendar_type_in_list === 'job')?self.my_job_number_on_server:self.my_quote_number_on_server;
                var temp_downloaded_number = (self.current_selected_calendar_type_in_list === 'job')?self.my_downloaded_job_number:self.my_downloaded_quote_number;
                var total_my_jobs_on_server = Ti.UI.createLabel({
                        text:'Total '+temp_number_on_server+' '+self.ucfirst(self.current_selected_calendar_type_in_list)+((temp_number_on_server>1)?'s':'')+', Displaying '+temp_downloaded_number+' '+self.ucfirst(self.current_selected_calendar_type_in_list)+((temp_downloaded_number>1)?'s':''),
                        width:300,
                        bottom:5,
                        height:12,
                        color:"#576c89",
                        textAlign:"center",
                        font:{
                                fontSize:12
                        }
                });                 
                row.add(total_my_jobs_on_server);
                self.list_data.push(row);
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.add_download_more_jobs_row_on_bottom');
                return;
        }
};
/**
 * show jobs,quotes in calendar view by selected date
 */
calendar_page.prototype.show_calendar = function(is_show_loading){
        var self = this;
        try{
                if(is_show_loading){
                        self.display_indicator('Loading Data ...');
                }    
                self.init_calendar_container();
                self.current_activate_view = self.calendar_container; 
                self.view_name = 'cal';
                self.calendar_date_label.text = self.day_list[self.calendar_day]+' '+((self.calendar_date<=9)?'0'+self.calendar_date:self.calendar_date)+'-'+self.month_list[self.calendar_month]+'-'+self.calendar_year;
                for(var i=0,j=self.calendar_data.length;i<j;i++){
                        self.day_scroll_view.remove(self.calendar_data[i]);
                }
                self.calendar_data = [];
                var temp_month = ((self.calendar_month+1) <=9)?'0'+(self.calendar_month+1):(self.calendar_month+1);
                var temp_date = (self.calendar_date <=9)?'0'+self.calendar_date:self.calendar_date;
                var calendar_string = self.calendar_year+'-'+temp_month+'-'+temp_date;
                var temp_start_value = calendar_string+' 00:00:00';
                var temp_end_value = calendar_string+' 23:59:59';
                self.get_job_data_for_show_calendar(temp_start_value,temp_end_value);
                self.get_quote_data_for_show_calendar(temp_start_value,temp_end_value);
                self.setup_matrix_row_in_scroll_view_for_show_calendar();
                self.job_and_quote_quantity_for_calendar.text = 'Jobs('+self.my_selected_job_number+')  Quotes('+self.my_selected_quote_number+')';
                
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.show_calendar');
                return;
        }
};
calendar_page.prototype.setup_matrix_row_in_scroll_view_for_show_calendar = function(){
        var self = this;
        try{
                var temp_data = self.setup_matrix_data_for_show_calendar();
                self.calendar_data = [];
                
                var temp_height_and_width_data_array = [];
                var last_num = 0;

                //figure out the position of every job
                for(var i=0,j=temp_data.length;i<j;i++){
                        last_num++;
                        var column_num_in_fact = 0;//how many column in fact
                        for(var m=0,n=temp_data[i].length;m<n;m++){
                                var new_width = 0;
                                var temp_array = [];
                                //figure out the width of every job, some jobs locate on same line.
                                if(temp_data[i].length > 1){
                                        //check how many job can display in same column
                                        var temp_same_column_num = 1;
                                        for(var b=0,c=temp_data[i].length;b<c;b++){
                                                if(temp_data[i][b].in_same_column){
                                                        temp_same_column_num++;
                                                }
                                        }
                                        //total number - temp_same_column_num = how many column in fact
                                        new_width = parseInt(self.calendar_today_job_default_width/temp_same_column_num,10);
                                }
                                var temp_height = 0;
                                var temp_top_height = 0;
                                if(temp_data[i][m].is_all_day){//if is a whole day job
                                        temp_height = self.calendar_today_hour_distance*24;
                                        self.scroll_to_height = 0;
                                        temp_top_height = self.calendar_today_top_distance;
                                }else{
                                        //if is not a whole day job
                                        if(temp_data[i][m].is_only_scheduled_from){
                                                temp_height = self.default_table_view_row_height;
                                                temp_top_height = self.calendar_today_top_distance+((temp_data[i][m].scheduled_from_hours)*self.calendar_today_hour_distance)+temp_data[i][m].scheduled_from_minutes;
                                        }else{
                                                if((temp_data[i][m].scheduled_to_hours === 0) && (temp_data[i][m].scheduled_to_minutes === 0)){
                                                        temp_height = (24-temp_data[i][m].scheduled_from_hours)*self.calendar_today_hour_distance-temp_data[i][m].scheduled_from_minutes;
                                                }else{
                                                        if(temp_data[i][m].scheduled_from_hours===0){
                                                                temp_height = ((((temp_data[i][m].scheduled_from_hours===0)?0:temp_data[i][m].scheduled_from_hours+1)*60+temp_data[i][m].scheduled_from_minutes)-(((temp_data[i][m].scheduled_to_hours===0)?0:temp_data[i][m].scheduled_to_hours)*60+temp_data[i][m].scheduled_to_minutes));
                                                        }else{
                                                                temp_height = ((((temp_data[i][m].scheduled_from_hours===0)?0:temp_data[i][m].scheduled_from_hours+1)*60+temp_data[i][m].scheduled_from_minutes)-(((temp_data[i][m].scheduled_to_hours===0)?0:temp_data[i][m].scheduled_to_hours+1)*60+temp_data[i][m].scheduled_to_minutes));
                                                        }
                                                        if(temp_height < 0){
                                                                temp_height = -temp_height;
                                                        }
                                                }
                                                if(temp_data[i][m].scheduled_from_hours === 0){
                                                        temp_top_height = self.calendar_today_top_distance+temp_data[i][m].scheduled_from_minutes;
                                                }else{
                                                        temp_top_height = self.calendar_today_top_distance+((temp_data[i][m].scheduled_from_hours)*self.calendar_today_hour_distance)+temp_data[i][m].scheduled_from_minutes;
                                                }
                                        }
                                        if(temp_height <= 15){
                                                temp_height = 15;
                                        }else{
                                                if(temp_height <= 30){
                                                        temp_height = 30;
                                                }else{
                                                        if(temp_height <= 45){
                                                                temp_height = 45;
                                                        }else{
                                                                if(temp_height <= 60){
                                                                        temp_height = 60;
                                                                }
                                                        }
                                                }
                                        }
                                        var temp_scroll_to_height = (temp_data[i][m].scheduled_from_hours === 0)?self.calendar_today_start_distance:self.calendar_today_start_distance+(temp_data[i][m].scheduled_from_hours-1)*self.calendar_today_hour_distance+temp_data[i][m].scheduled_from_minutes;
                                        if(self.scroll_to_height === -1){
                                                self.scroll_to_height = temp_scroll_to_height;
                                        }else{
                                                if(self.scroll_to_height > temp_scroll_to_height){
                                                        self.scroll_to_height = temp_scroll_to_height;
                                                }
                                        }
                                }

                                if(m != 0){
                                        column_num_in_fact++;
                                }
                                var temp_left = (m==0)?self.calendar_today_left_distance:(column_num_in_fact*new_width+self.calendar_today_left_distance);
                                var temp_width = (new_width==0)?self.calendar_today_job_default_width:new_width;

                                if(i==0){
                                        temp_array = {
                                                left:temp_left,
                                                width:temp_width,
                                                top:temp_top_height,
                                                bottom:temp_top_height+temp_height
                                        };
                                        temp_height_and_width_data_array.push(temp_array);
                                }else{
                                        var how_many_job_left_side_less_than_current_job = 0;
                                        for(var x=0,y=temp_height_and_width_data_array.length;x<y;x++){
                                                if((temp_top_height > temp_height_and_width_data_array[x].top)&&(temp_top_height <temp_height_and_width_data_array[x].bottom)){
                                                        how_many_job_left_side_less_than_current_job++;
                                                }
                                        }
                                        if(how_many_job_left_side_less_than_current_job > 0){
                                                temp_left = temp_left+5;
                                                temp_width = temp_width;
                                        }
                                        temp_array = {
                                                left:temp_left,
                                                width:temp_width,
                                                top:temp_top_height,
                                                bottom:temp_top_height+temp_height
                                        };
                                        temp_height_and_width_data_array.push(temp_array);
                                }

                                var status_colour = '';
                                if(temp_data[i][m].job_type === 'job'){
                                        for(var a_a=0,a_b=self.job_status_code_array.length;a_a<a_b;a_a++){
                                                if(self.job_status_code_array[a_a].code == temp_data[i][m].job_status_code){
                                                        status_colour = self.job_status_code_array[a_a].colour;
                                                        break;
                                                }
                                        }     
                                }else{
                                        for(a_a=0,a_b=self.quote_status_code_array.length;a_a<a_b;a_a++){
                                                if(self.quote_status_code_array[a_a].code == temp_data[i][m].job_status_code){
                                                        status_colour = self.quote_status_code_array[a_a].colour;
                                                        break;
                                                }
                                        }                                        
                                }                                  
                                
                                
                                var row = Ti.UI.createView({
                                        className:'show_day_data_row_'+i,
                                        top:temp_top_height,
                                        left:temp_left,
                                        height:temp_height,
                                        width:temp_width,
                                        job_type:temp_data[i][m].job_type,
                                        job_id:temp_data[i][m].job_id,
                                        job_reference_number:temp_data[i][m].job_reference_number,
                                        job_status_code:temp_data[i][m].job_status_code,
                                        borderWidth:1,
                                        borderRadius:5,
                                        opacity:0.5,
                                        backgroundColor:(status_colour != '')?status_colour:self.job_default_status_colour//self.calendar_today_job_background_color,
                                });

                                var row_job_reference_number = Ti.UI.createLabel({
                                        job_type:temp_data[i][m].job_type,
                                        job_id:temp_data[i][m].job_id,
                                        job_reference_number:temp_data[i][m].job_reference_number,
                                        job_status_code:temp_data[i][m].job_status_code,
                                        text:self.ucfirst(temp_data[i][m].job_type)+' No. - '+temp_data[i][m].job_reference_number,
                                        height:15,
                                        left:5,
                                        top:0,
                                        font:{
                                                fontSize:self.small_font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                if(temp_height >15){
                                        row_job_reference_number.height = 20;
                                        row_job_reference_number.top = 5;
                                }
                                row.add(row_job_reference_number);

                                var row_address_label = Ti.UI.createLabel({
                                        job_type:temp_data[i][m].job_type,
                                        job_id:temp_data[i][m].job_id,
                                        job_reference_number:temp_data[i][m].job_reference_number,
                                        job_status_code:temp_data[i][m].job_status_code,
                                        text:temp_data[i][m].address,
                                        height:20,
                                        left:5,
                                        top:25,
                                        font:{
                                                fontSize:self.middle_font_size
                                        }
                                });
                                row.add(row_address_label);

                                var job_description_len = ((temp_data[i][m].job_title != '')&&(temp_data[i][m].job_title != undefined))?temp_data[i][m].job_title.length:0;
                                var row_num = (job_description_len > 0)?parseInt(job_description_len*8/(temp_width),10):1;
                                if(row_num === 0){
                                        row_num = 1;
                                }
                                var row_description_label_height = 0;
                                if((temp_height-45)>=(row_num*20)){
                                        row_description_label_height = row_num*20;
                                }else{
                                        var temp_i=1;
                                        while(((temp_i*20) < (temp_height-45)) && (((temp_i+1)*20) < (temp_height-45))){
                                                temp_i++;
                                        }
                                        row_description_label_height = temp_i*20;
                                }

                                var row_description_label = Ti.UI.createLabel({
                                        job_type:temp_data[i][m].job_type,
                                        job_id:temp_data[i][m].job_id,
                                        job_reference_number:temp_data[i][m].job_reference_number,
                                        job_status_code:temp_data[i][m].job_status_code,
                                        text:temp_data[i][m].job_title,
                                        height:row_description_label_height,
                                        left:5,
                                        top:45,
                                        font:{
                                                fontSize:self.middle_font_size
                                        }
                                });
                                if(row_description_label_height < row_num*20){
                                        row_description_label.bottom = 5;
                                }
                                row.add(row_description_label);
                                
                                self.calendar_data.push(row);
                                self.day_scroll_view.add(row);
                                row.addEventListener('click',function(e){
                                        self.calendar_row_click_event(e);
                                });
                        }
                }
                self.day_scroll_view.scrollTo(0,self.scroll_to_height);
                self.scroll_to_height = -1;
                if(last_num >= (temp_data.length-1)){
                        setTimeout(function(){
                                self.hide_indicator();
                        },500);
                }
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.setup_matrix_row_in_scroll_view_for_show_calendar');
                return;
        }
};
calendar_page.prototype.setup_matrix_data_for_show_calendar = function(){
        var self = this;
        try{
                var temp_data = [];// jobs list in single row (these job keep a whole row)
                var temp_sub_data = [];//jobs list in single row(these job share a whole row)
                //sort data by scheduled from
                self.calendar_data.sort(function(a,b){
                        if(a.scheduled_from_hours != b.scheduled_from_hours){
                                return a.scheduled_from_hours - b.scheduled_from_hours;
                        }else{//compare the minutes
                                return a.scheduled_from_minutes - b.scheduled_from_minutes;
                        }
                });
                var pre_job_id = 0;
                //var pre_job_time = 0;
                for(var i=0,j=self.calendar_data.length;i<j;i++){
                        if(pre_job_id === 0){//set first job of today
                                pre_job_id = self.calendar_data[i].job_id;
                                //pre_job_time = (self.calendar_data[i].scheduled_from_hours*60+self.calendar_data[i].scheduled_from_minutes)*60;
                                temp_sub_data.push(self.calendar_data[i]);
                        }else{
                                //if this job is inside of any job of temp_sub_data, then push it to temp_sub_data
                                var temp_inside_flag = false;
                                for(var m=0,n=temp_sub_data.length;m<n;m++){
                                        if((self.calendar_data[i].scheduled_from_hours === temp_sub_data[m].scheduled_from_hours)&& (self.calendar_data[i].scheduled_from_minutes === temp_sub_data[m].scheduled_from_minutes)){
                                                temp_inside_flag = true;
                                        }else{
                                                if(temp_sub_data[m].is_only_scheduled_from){
                                                        if((((self.calendar_data[i].scheduled_from_hours*60+self.calendar_data[i].scheduled_from_minutes)*60) >= ((temp_sub_data[m].scheduled_from_hours*60+temp_sub_data[m].scheduled_from_minutes)*60)) &&
                                                                (((self.calendar_data[i].scheduled_from_hours*60+self.calendar_data[i].scheduled_from_minutes)*60) < ((temp_sub_data[m].scheduled_from_hours*60+temp_sub_data[m].scheduled_from_minutes+45)*60))){
                                                                temp_inside_flag = true;
                                                                break;
                                                        }
                                                }else{
                                                        if((((self.calendar_data[i].scheduled_from_hours*60+self.calendar_data[i].scheduled_from_minutes)*60) >= ((temp_sub_data[m].scheduled_from_hours*60+temp_sub_data[m].scheduled_from_minutes)*60)) &&
                                                                (((self.calendar_data[i].scheduled_from_hours*60+self.calendar_data[i].scheduled_from_minutes)*60) < ((temp_sub_data[m].scheduled_to_hours*60+temp_sub_data[m].scheduled_to_minutes)*60))){
                                                                temp_inside_flag = true;
                                                                break;
                                                        }
                                                }
                                        }
                                }
                                if(temp_inside_flag){
                                        //if current job's scheduled from is equal or great than last job's scheduled to,
                                        //then these two job can display in the same column
                                        //if(((self.calendar_data[i].scheduled_from_hours*60+self.calendar_data[i].scheduled_from_minutes)*60) >= ((temp_sub_data[temp_sub_data.length-1].scheduled_to_hours*60+temp_sub_data[temp_sub_data.length-1].scheduled_to_minutes)*60)){
                                        self.calendar_data[i].in_same_column = true;
                                        temp_sub_data.push(self.calendar_data[i]);
                                }else{
                                        //if great than 1 hours between two jobs
                                        //push last jobs data(temp_sub_data) to temp_data
                                        //then check new job position
                                        temp_data.push(temp_sub_data);
                                        temp_sub_data = [];
                                        temp_sub_data.push(self.calendar_data[i]);
                                        pre_job_id = self.calendar_data[i].job_id;
                                //pre_job_time = (self.calendar_data[i].scheduled_from_hours*60+self.calendar_data[i].scheduled_from_minutes)*60;
                                }
                        }
                }
                if(temp_sub_data.length > 0){
                        temp_data.push(temp_sub_data);
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.setup_matrix_data_for_show_calendar');
                return false;
        }
        return temp_data;
};
calendar_page.prototype.get_job_data_for_show_calendar = function(temp_start_value,temp_end_value){
        var self = this;
        try{
                var startDateValue = self.get_seconds_value_by_time_string(temp_start_value);
                var endDateValue = self.get_seconds_value_by_time_string(temp_end_value);                
                var temp_day_type = 'job';
                var sql_params ={
                        is_task:false,
                        is_calendar:true,//in calendar or in filter
                        is_scheduled:true,//query assigned_from is not null
                        is_check_changed:false,//check changed field or not
                        is_check_self_job:true,//only check current user's job
                        order_by:'my_'+temp_day_type+'_assigned_user.assigned_from desc',
                        is_search:false,
                        search_string:'',
                        extra_left_join_condition:
                        '('+
                        '(my_'+temp_day_type+'_assigned_user.assigned_from <=\''+temp_end_value+'\' and my_'+temp_day_type+'_assigned_user.assigned_to >=\''+temp_start_value+'\') or '+
                        '(my_'+temp_day_type+'_assigned_user.assigned_from <=\''+temp_end_value+'\' and my_'+temp_day_type+'_assigned_user.assigned_to >=\''+temp_end_value+'\') or '+
                        '(my_'+temp_day_type+'_assigned_user.assigned_from >=\''+temp_start_value+'\' and my_'+temp_day_type+'_assigned_user.assigned_from <=\''+temp_end_value+'\') '+
                        ')',
                        extra_where_condition:'',
                        type:temp_day_type,
                        user_id:self.selected_user_id,
                        company_id:self.selected_company_id,
                        job_status_code:-1
                };
                
                var sql = self.setup_sql_query_for_display_job_list(sql_params);
                var db = Titanium.Database.open(self.get_db_name());
                var rows = db.execute(sql);
                self.my_selected_job_number = rows.getRowCount();
                if(rows.getRowCount() > 0){
                        while(rows.isValidRow()){
                                self.set_calendar_row(rows,startDateValue,endDateValue,'job');
                                rows.next();
                        }
                }
                rows.close();
                db.close();
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.get_job_data_for_show_calendar');
                return;
        }
};
calendar_page.prototype.get_quote_data_for_show_calendar = function(temp_start_value,temp_end_value){
        var self = this;
        try{
                var startDateValue = self.get_seconds_value_by_time_string(temp_start_value);
                var endDateValue = self.get_seconds_value_by_time_string(temp_end_value);
                //query quote
                var temp_day_type = 'quote';
                var sql_params ={
                        is_task:false,
                        is_calendar:true,//in calendar or in filter
                        is_scheduled:true,//query assigned_from is not null
                        is_check_changed:false,//check changed field or not
                        is_check_self_job:true,//only check current user's job
                        order_by:'my_'+temp_day_type+'_assigned_user.assigned_from desc',
                        is_search:false,
                        extra_left_join_condition:
                        '('+
                        '(my_'+temp_day_type+'_assigned_user.assigned_from <=\''+temp_end_value+'\' and my_'+temp_day_type+'_assigned_user.assigned_to >=\''+temp_start_value+'\') or '+
                        '(my_'+temp_day_type+'_assigned_user.assigned_from <=\''+temp_end_value+'\' and my_'+temp_day_type+'_assigned_user.assigned_to >=\''+temp_end_value+'\') or '+
                        '(my_'+temp_day_type+'_assigned_user.assigned_from >=\''+temp_start_value+'\' and my_'+temp_day_type+'_assigned_user.assigned_from <=\''+temp_end_value+'\') '+
                        ')',
                        extra_where_condition:'',
                        type:temp_day_type,
                        user_id:self.selected_user_id,
                        company_id:self.selected_company_id,
                        job_status_code:-1
                };
                var sql = self.setup_sql_query_for_display_job_list(sql_params);
                var db = Titanium.Database.open(self.get_db_name());
                var rows = db.execute(sql);
                self.my_selected_quote_number = rows.getRowCount();
                if(rows.getRowCount() > 0){
                        while(rows.isValidRow()){
                                self.set_calendar_row(rows,startDateValue,endDateValue,'quote');
                                rows.next();
                        }
                }
                rows.close();
                db.close();
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.get_quote_data_for_show_calendar');
                return;
        }
};
calendar_page.prototype.calendar_row_click_event = function(e){
        var self = this;
        try{
                if((e.source.job_type === null)||(e.source.job_type === undefined)){
                        e.source = e.source.parent;
                }
                if(e.source.job_id > 0){
                        var new_win = Ti.UI.createWindow({
                                type:e.source.job_type,
                                url:self.get_file_path('url','job/edit/job_index_view.js'),
                                action_for_job:'edit_job',
                                job_id:e.source.job_id,
                                job_reference_number:e.source.job_reference_number,
                                job_status_code:e.source.job_status_code
                        });
                        Ti.UI.currentTab.open(new_win,{
                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                        });
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.calendar_row_click_event');
                return;
        }
};
/**
 * show jobs,quotes by selected date
 */
calendar_page.prototype.show_day = function(is_show_loading){
        var self = this;
        try{
                if(is_show_loading){
                        self.display_indicator('Loading Data ...');
                }                                
                self.init_day_container();
                self.current_activate_view = self.day_list_container;
                self.view_name = 'day';
                self.day_list_date_label.text = self.day_list[self.calendar_day]+' '+((self.calendar_date<=9)?'0'+self.calendar_date:self.calendar_date)+'-'+self.month_list[self.calendar_month]+'-'+self.calendar_year;
                self.day_list_data = [];
                self.day_list_table_view.setData([]);

                //get data
                
                var temp_start_value = self.calendar_year+'-'+((self.calendar_month+1)<=9?'0'+(self.calendar_month+1):(self.calendar_month+1))+'-'+((self.calendar_date)<=9?'0'+(self.calendar_date):(self.calendar_date))+' 00:00:00';
                var temp_end_value = self.calendar_year+'-'+((self.calendar_month+1)<=9?'0'+(self.calendar_month+1):(self.calendar_month+1))+'-'+((self.calendar_date)<=9?'0'+(self.calendar_date):(self.calendar_date))+' 23:59:59';                
                var db = Titanium.Database.open(self.get_db_name());
                self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'job',temp_start_value,temp_end_value,0);
                self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'quote',temp_start_value,temp_end_value,self.day_list_data.length);
                db.close();
                self.day_list_table_view.setData(self.day_list_data);
                
                //set background color for rows
                for(var i=0,j=self.day_list_data.length;i<j;i++){
                        if(i%2 === 0){
                                self.day_list_data[i].backgroundColor = self.job_list_row_background_color;
                        }else{
                                self.day_list_data[i].backgroundColor = '#fff';
                        }
                }
                if(self.day_list_data.length > 0){
                        self.day_list_no_result_label.visible = false;
                        self.day_list_table_view.setData(self.day_list_data);
                }else{
                        self.day_list_no_result_label.visible = true;
                        self.day_list_no_result_label.textAlign ='center';
                }
                self.job_and_quote_quantity_for_day.text = 'Jobs('+self.my_selected_job_number+')  Quotes('+self.my_selected_quote_number+')';
                setTimeout(function(){
                        self.hide_indicator();
                },500);  
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.show_day');
                return;
        }
};

/**
 * show jobs,quotes by selected date of week
 */
calendar_page.prototype.show_week = function(is_show_loading){
        var self = this;
        try{
                if(is_show_loading){
                        self.display_indicator('Loading Data ...');
                }                                
                self.init_week_container();
                self.current_activate_view = self.week_container;
                self.view_name = 'week';
                self.week_data = [];
                self.current_day_data_of_week = [];
                self.get_data_for_show_week();
                self.show_data_for_show_week();
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.show_week');
                return;
        }
};
calendar_page.prototype.get_data_for_show_week = function(){
        var self = this;
        try{
                var temp_month = ((self.calendar_month+1) <=9)?'0'+(self.calendar_month+1):(self.calendar_month+1);
                var temp_date = (self.calendar_date <=9)?'0'+self.calendar_date:self.calendar_date;
                var selected_date_string = self.calendar_year+'-'+temp_month+'-'+temp_date;

                var selected_date_array = selected_date_string.split('-');
                var selected_year = parseInt(selected_date_array[0],10);
                var selected_month = parseInt(selected_date_array[1],10)-1;
                var selected_date = parseInt(selected_date_array[2],10);
                var start_date = self.get_the_first_day_of_this_week(selected_year, selected_month, selected_date);

                //get start day info
                var start_day_array = start_date.split('-');
                var year_of_start_day = parseInt(start_day_array[0],10);
                var month_of_start_day = parseInt(start_day_array[1],10)-1;
                var date_of_start_day = parseInt(start_day_array[2],10);
                var temp_start_date = new Date(year_of_start_day,month_of_start_day,date_of_start_day);
                var million_time_value = temp_start_date.getTime()+6*24*60*60*1000;
                var temp_end_date = new Date(million_time_value);
                var month_of_end_day = temp_end_date.getMonth();
                var date_of_end_day = temp_end_date.getDate();
                self.week_date_label.text = ((date_of_start_day)<=9?'0'+(date_of_start_day):(date_of_start_day))+'-'+self.month_list[month_of_start_day];
                self.week_date_label.text += ' To ';
                self.week_date_label.text += ((date_of_end_day)<=9?'0'+(date_of_end_day):(date_of_end_day))+'-'+self.month_list[month_of_end_day];

                var temp_info = null;
                var temp_new_year = year_of_start_day;
                var temp_new_month = month_of_start_day;
                var temp_new_date = date_of_start_day;

                //add all days of this month
                var db = Titanium.Database.open(self.get_db_name());
                for(var i=0;i<7;i++){
                        var temp_start_value = '';
                        var temp_end_value = '';
                        if(i === 0){
                                temp_start_value = temp_new_year+'-'+((temp_new_month+1)<=9?'0'+(temp_new_month+1):(temp_new_month+1))+'-'+((temp_new_date)<=9?'0'+(temp_new_date):(temp_new_date))+' 00:00:00';
                                temp_end_value = temp_new_year+'-'+((temp_new_month+1)<=9?'0'+(temp_new_month+1):(temp_new_month+1))+'-'+((temp_new_date)<=9?'0'+(temp_new_date):(temp_new_date))+' 23:59:59';
                        }else{
                                temp_new_date++;
                                if(temp_new_date > self.days_number_of_month(temp_new_year,temp_new_month)){
                                        temp_new_date -= self.days_number_of_month(temp_new_year,temp_new_month);
                                        temp_new_month++;
                                        if(temp_new_month > 11){
                                                temp_new_month = 0;
                                                temp_new_year++;
                                        }
                                }
                                temp_start_value = temp_new_year+'-'+((temp_new_month+1)<=9?'0'+(temp_new_month+1):(temp_new_month+1))+'-'+((temp_new_date)<=9?'0'+(temp_new_date):(temp_new_date))+' 00:00:00';
                                temp_end_value = temp_new_year+'-'+((temp_new_month+1)<=9?'0'+(temp_new_month+1):(temp_new_month+1))+'-'+((temp_new_date)<=9?'0'+(temp_new_date):(temp_new_date))+' 23:59:59';
                        }
                        var is_has_job = false;
                        self.current_day_data_of_week = [];
                        self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'job',temp_start_value,temp_end_value,0);
                        if(self.current_day_data_of_week.length > 0){
                                is_has_job = true;
                        }
                        if(!is_has_job){
                                self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'quote',temp_start_value,temp_end_value,self.current_day_data_of_week.length);
                                if(self.current_day_data_of_week.length > 0){
                                        is_has_job = true;
                                }
                        }
                        
                        if(!is_has_job){
                                var temp_week_date = temp_new_year+'-'+((temp_new_month+1)<=9?'0'+(temp_new_month+1):(temp_new_month+1))+'-'+((temp_new_date)<=9?'0'+(temp_new_date):(temp_new_date));
                                var rows  = db.execute('select * from my_job_and_quote_count_info where date=\''+temp_week_date+'\'');
                                if(rows!=null && rows.fieldByName('job_count') > 0){
                                        is_has_job = true;
                                }else{
                                        if(rows!=null && rows.fieldByName('quote_count') > 0){
                                                is_has_job = true;
                                        }
                                }
                                rows.close();
                        }

                        temp_info = {
                                type:'current_week',
                                text:temp_new_year+'-'+((temp_new_month+1)<=9?'0'+(temp_new_month+1):(temp_new_month+1))+'-'+((temp_new_date)<=9?'0'+(temp_new_date):(temp_new_date)),
                                date:temp_new_date,
                                is_has_job:is_has_job
                        };
                        self.week_data.push(temp_info);
                }
                db.close();
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.get_data_for_show_week');
                return;
        }
};
calendar_page.prototype.show_data_for_show_week = function(){
        var self = this;
        try{
                var last_num = 0;
                var temp_month = ((self.calendar_month+1) <=9)?'0'+(self.calendar_month+1):(self.calendar_month+1);
                var temp_date = (self.calendar_date <=9)?'0'+self.calendar_date:self.calendar_date;
                var selected_date_string = self.calendar_year+'-'+temp_month+'-'+temp_date;
                var total_rows = 1;
                var total_cols = 7;
                for(var i=0;i<1;i++){
                        for(var j=0;j<total_cols;j++){
                                last_num++;
                                var c_w_obj = self.week_view.children[i*7+j];
                                if((i+1)<=total_rows){
                                        c_w_obj.visible = true;
                                        if(c_w_obj === undefined){

                                        }else{
                                                if(self.week_data[i*7+j].type === 'current_week'){
                                                        c_w_obj.is_current_week = true;
                                                        c_w_obj.children[0].text = self.week_data[i*7+j].date;
                                                        c_w_obj.date_string = self.week_data[i*7+j].text;
                                                        c_w_obj.is_has_job = self.week_data[i*7+j].is_has_job;
                                                        if(selected_date_string === self.week_data[i*7+j].text){
                                                                c_w_obj.backgroundColor = 'blue';
                                                                c_w_obj.children[0].color = '#fff';
                                                        }else{
                                                                c_w_obj.backgroundColor = self.default_tool_bar_background_color;//tool_bar_background_color;
                                                                c_w_obj.children[0].color = self.calendar_font_color;
                                                        }
                                                        if((c_w_obj.children[1] === undefined) || (c_w_obj.children[1] === null)){
                                                                
                                                        }else{
                                                                if(c_w_obj.is_has_job){
                                                                        c_w_obj.children[1].backgroundColor = (selected_date_string === self.week_data[i*7+j].text)?'#fff':'#000';
                                                                }else{
                                                                        c_w_obj.children[1].backgroundColor = (selected_date_string === self.week_data[i*7+j].text)?'blue':self.default_tool_bar_background_color;//tool_bar_background_color;
                                                                }
                                                        }
                                                }else{
                                                        c_w_obj.is_current_week = false;
                                                        c_w_obj.date_string = '';
                                                        c_w_obj.children[0].text = '';
                                                        c_w_obj.backgroundColor = self.default_tool_bar_background_color;//tool_bar_background_color;
                                                        c_w_obj.children[0].color = self.calendar_font_color;
                                                        c_w_obj.is_has_job = false;
                                                        if((c_w_obj.children[1] === undefined) || (c_w_obj.children[1] === null)){
                                                                
                                                        }else{
                                                                c_w_obj.children[1].backgroundColor = c_w_obj.backgroundColor;
                                                        }
                                                }
                                                if(selected_date_string === self.week_data[i*7+j].text){
                                                        //get data
                                                        var db = Titanium.Database.open(self.get_db_name());
                                                        var temp_start_value = selected_date_string+' 00:00:00';
                                                        var temp_end_value = selected_date_string+' 23:59:59';                                                        
                                                        self.current_day_data_of_week = [];
                                                        self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'job',temp_start_value,temp_end_value,0);
                                                        self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'quote',temp_start_value,temp_end_value,self.current_day_data_of_week.length);
                                                        db.close();
                                                        for(var m=0,n=self.current_day_data_of_week.length;m<n;m++){
                                                                if(m%2 === 0){
                                                                        self.current_day_data_of_week[m].backgroundColor = self.job_list_row_background_color;
                                                                }else{
                                                                        self.current_day_data_of_week[m].backgroundColor = '#fff';
                                                                }
                                                        }                                                              
                                                        self.week_table_view.data = self.current_day_data_of_week;
                                                        if(self.current_day_data_of_week.length > 0){
                                                                self.week_no_result_label.visible = false;
                                                        }else{
                                                                self.week_no_result_label.visible = true;
                                                        }
                                                        self.pre_selected_week_btn = c_w_obj;
                                                }
                                        }
                                }else{
                                        c_w_obj.visible = false;
                                }
                        }
                }
                self.week_view.height = total_rows*(self.avg_width-8);
                self.week_table_view.top = self.tool_bar_height+total_rows*(self.avg_width-8);
                if(last_num >= total_cols*1){
                        setTimeout(function(){
                                self.hide_indicator();
                        },500);
                }                  
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.show_data_for_show_week');
                return;
        }
};
/**
 * show jobs,quotes by selected date of month
 */
calendar_page.prototype.show_month = function(is_show_loading){
        var self = this;
        try{
                if(is_show_loading){
                        self.display_indicator('Loading Data ...');
                }      
                self.init_month_container();
                self.current_activate_view = self.month_container;
                self.view_name = 'month';
                self.month_date_label.text = self.month_list[self.calendar_month]+'-'+self.calendar_year;
                self.month_data = [];
                self.current_day_data_of_month = [];
                self.get_data_for_show_month();
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.show_month');
                return;
        }
};
calendar_page.prototype.get_data_for_show_month = function(){
        var self = this;
        try{
                var temp_month = ((self.calendar_month+1) <=9)?'0'+(self.calendar_month+1):(self.calendar_month+1);
                var temp_date = (self.calendar_date <=9)?'0'+self.calendar_date:self.calendar_date;
                var selected_date_string = self.calendar_year+'-'+temp_month+'-'+temp_date;

                var selected_date_array = selected_date_string.split('-');
                var selected_year = parseInt(selected_date_array[0],10);
                var selected_month = parseInt(selected_date_array[1],10)-1;
                var how_many_days_in_this_month = self.days_number_of_month(selected_year,selected_month);
                //var selected_date_value = new Date(selected_year,selected_month,selected_date);

                //figure out how many rows
                //first figure out the position of 1st day of this month
                var tempDate = new Date(selected_year,selected_month,1);
                var day_of_1st_date = tempDate.getDay();
                if(day_of_1st_date === 0){
                        day_of_1st_date = 7;
                }
                //figure out how many days in last month
                var last_month = selected_month-1;
                var last_year = selected_year;
                if(last_month < 0){
                        last_month = 11;
                        last_year--;
                }
                var how_many_days_in_last_month = self.days_number_of_month(last_year,last_month);
                var total_rows = parseInt(((day_of_1st_date-1+how_many_days_in_this_month)/7),10)+((((day_of_1st_date-1+how_many_days_in_this_month)%7)>0)?1:0);
                var total_cols = 7;
                var temp_how_many_days_in_last_month = how_many_days_in_last_month;
                var temp_info = null;
                //add some days of last month
                for(var i=1;i<day_of_1st_date;i++){
                        temp_info = {
                                type:'last_month',
                                text:last_year+'-'+(((last_month+1)<=9)?'0'+(last_month+1):(last_month+1))+'-'+((temp_how_many_days_in_last_month)<=9?'0'+temp_how_many_days_in_last_month:temp_how_many_days_in_last_month),
                                date:temp_how_many_days_in_last_month,
                                is_has_job:false
                        };
                        temp_how_many_days_in_last_month--;
                        self.month_data.push(temp_info);
                }
                self.month_data.sort(function(a,b){
                        return a.date - b.date;
                });
                //add all days of this month
                var db = Titanium.Database.open(self.get_db_name());
                for(i=0;i<how_many_days_in_this_month;i++){
                        var temp_start_value = selected_year+'-'+((selected_month+1)<=9?'0'+(selected_month+1):(selected_month+1))+'-'+((i+1)<=9?'0'+(i+1):(i+1))+' 00:00:00';
                        var temp_end_value = selected_year+'-'+((selected_month+1)<=9?'0'+(selected_month+1):(selected_month+1))+'-'+((i+1)<=9?'0'+(i+1):(i+1))+' 23:59:59';
                        var is_has_job = false;
                        self.current_day_data_of_month = [];
                        self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'job',temp_start_value,temp_end_value,0);
                        if(self.current_day_data_of_month.length>0){
                                is_has_job = true;
                        }
                        if(!is_has_job){
                                self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'quote',temp_start_value,temp_end_value,self.current_day_data_of_month.length);
                                if(self.current_day_data_of_month.length > 0){
                                        is_has_job = true;
                                }
                        }
                        
                        if(!is_has_job){
                                var temp_month_date = selected_year+'-'+((selected_month+1)<=9?'0'+(selected_month+1):(selected_month+1))+'-'+((i+1)<=9?'0'+(i+1):(i+1));
                                var rows  = db.execute('select * from my_job_and_quote_count_info where date=\''+temp_month_date+'\'');
                                if(rows!=null && rows.fieldByName('job_count') > 0){
                                        is_has_job = true;
                                }else{
                                        if(rows!=null && rows.fieldByName('quote_count') > 0){
                                                is_has_job = true;
                                        }
                                }
                                rows.close();
                        }                        

                        temp_info = {
                                type:'current_month',
                                text:selected_year+'-'+((selected_month+1)<=9?'0'+(selected_month+1):(selected_month+1))+'-'+((i+1)<=9?'0'+(i+1):(i+1)),
                                date:(i+1),
                                is_has_job:is_has_job
                        };
                        self.month_data.push(temp_info);

                }
                db.close();

                //add some days of next month
                var next_month = selected_month+1;
                var next_year = selected_year;
                if(next_month > 11){
                        next_month = 0;
                        next_year++;
                }
                var days_of_next_month = total_rows*7-self.month_data.length;
                if(days_of_next_month > 0){
                        for(i=0;i<days_of_next_month;i++){
                                temp_info = {
                                        type:'next_month',
                                        text:next_year+'-'+((next_month+1)<=9?'0'+(next_month+1):(next_month+1))+'-'+((i+1)<=9?'0'+(i+1):(i+1)),
                                        date:(i+1),
                                        is_has_job:false
                                };
                                self.month_data.push(temp_info);
                        }
                }
                self.show_data_for_show_month(total_cols,total_rows);
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.get_data_for_show_month');
                return;
        }
};
calendar_page.prototype.show_data_for_show_month = function(total_cols,total_rows){
        var self = this;
        try{
                var temp_month = ((self.calendar_month+1) <=9)?'0'+(self.calendar_month+1):(self.calendar_month+1);
                var temp_date = (self.calendar_date <=9)?'0'+self.calendar_date:self.calendar_date;
                var selected_date_string = self.calendar_year+'-'+temp_month+'-'+temp_date;
                var last_num = 0;
                for(var i=0;i<6;i++){
                        for(var j=0;j<total_cols;j++){
                                last_num++;
                                var c_m_obj = self.month_view.children[i*7+j];
                                if((i+1)<=total_rows){
                                        c_m_obj.visible = true;
                                        if(c_m_obj === undefined){

                                        }else{
                                                if(self.month_data[i*7+j].type === 'current_month'){
                                                        c_m_obj.is_current_month = true;
                                                        c_m_obj.children[0].text = self.month_data[i*7+j].date;
                                                        c_m_obj.date_string = self.month_data[i*7+j].text;
                                                        c_m_obj.is_has_job = self.month_data[i*7+j].is_has_job;
                                                        if(selected_date_string === self.month_data[i*7+j].text){
                                                                c_m_obj.backgroundColor = 'blue';
                                                                c_m_obj.children[0].color = '#fff';
                                                        }else{
                                                                c_m_obj.backgroundColor = self.default_tool_bar_background_color;//tool_bar_background_color;
                                                                c_m_obj.children[0].color = self.calendar_font_color;
                                                        }
                                                        if((c_m_obj.children[1] === undefined) || (c_m_obj.children[1] === null)){                                                                
                                                        }else{
                                                                if(self.month_data[i*7+j].is_has_job){
                                                                        c_m_obj.children[1].backgroundColor = (selected_date_string === self.month_data[i*7+j].text)?'#fff':'#fff';
                                                                }else{
                                                                        c_m_obj.children[1].backgroundColor = (selected_date_string === self.month_data[i*7+j].text)?'blue':self.default_tool_bar_background_color;//tool_bar_background_color;
                                                                }
                                                        }
                                                }else{
                                                        c_m_obj.is_current_month = false;
                                                        c_m_obj.date_string = '';
                                                        c_m_obj.children[0].text = '';
                                                        c_m_obj.backgroundColor = self.default_tool_bar_background_color;//tool_bar_background_color;
                                                        c_m_obj.children[0].color = self.calendar_font_color;
                                                        c_m_obj.is_has_job = false;
                                                        if((c_m_obj.children[1] === undefined) || (c_m_obj.children[1] === null)){                                                                
                                                        }else{                                                        
                                                                c_m_obj.children[1].backgroundColor = c_m_obj.backgroundColor;
                                                        }
                                                }
                                                if(selected_date_string === self.month_data[i*7+j].text){
                                                        var db = Titanium.Database.open(self.get_db_name());
                                                        var temp_start_value = selected_date_string+' 00:00:00';
                                                        var temp_end_value = selected_date_string+' 23:59:59';                                                        
                                                        self.current_day_data_of_month = [];
                                                        self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'job',temp_start_value,temp_end_value,0);
                                                        self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'quote',temp_start_value,temp_end_value,self.current_day_data_of_month.length);
                                                        db.close();          
                                                        for(var m=0,n=self.current_day_data_of_month.length;m<n;m++){
                                                                if(m%2 === 0){
                                                                        self.current_day_data_of_month[m].backgroundColor = self.job_list_row_background_color;
                                                                }else{
                                                                        self.current_day_data_of_month[m].backgroundColor = '#fff';
                                                                }
                                                        }                                                         
                                                        self.month_table_view.data = self.current_day_data_of_month;
                                                        if(self.current_day_data_of_month.length > 0){
                                                                self.month_no_result_label.visible = false;
                                                        }else{
                                                                self.month_no_result_label.visible = true;
                                                        }
                                                        self.pre_selected_month_btn = c_m_obj;
                                                }
                                        }
                                }else{
                                        c_m_obj.visible = false;
                                }
                        }
                }
                self.month_view.height = total_rows*(self.avg_width-8);
                self.month_table_view.top = self.tool_bar_height+total_rows*(self.avg_width-8);
                if(last_num >= total_cols*6){
                        setTimeout(function(){
                                self.hide_indicator();
                        },500);
                }                
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.show_data_for_show_month');
                return;
        }
};
/**
 * init list view, create components in list container
 */
calendar_page.prototype.init_list_container = function(){
        var self = this;
        try{
                if((self.list_container === undefined)||(self.list_container === null)){
                        //init variables
                        self.list_data = [];
                        self.init_some_controls_for_list_container();
                        self.list_table_view.headerPullView = self.init_pull_down_view();
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_list_container');
                return;
        }
};
calendar_page.prototype.init_some_controls_for_list_container = function(){
        var self = this;
        try{               
                self.list_container = Ti.UI.createView({
                        width:self.screen_width,
                        height:Titanium.UI.currentWindow.height,
                        zIndex:3,
                        top:0
                });
                //Titanium.UI.currentWindow.add(self.list_container);

                self.top_tool_bar_of_list_container = Ti.UI.createView({
                        borderWidth:0,
                        top:0,
                        width:self.screen_width,
                        height:self.tool_bar_height,
                        backgroundColor:self.default_tool_bar_background_color                        
                });
                self.list_container.add(self.top_tool_bar_of_list_container);

                //top toolbar
                if(self.is_iphone_os()){
                        self.calendar_type_bar_of_list = Titanium.UI.iOS.createTabbedBar({
                                labels:['Job', 'Quote'],
                                style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
                                left:10,
                                height:30,
                                width:'35%',
                                index:0
                        });
                }else{
                        self.calendar_type_bar_of_list = Titanium.UI.createButtonBar({
                                labels:['Job', 'Quote'],
                                style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
                                left:10,
                                height:30,
                                width:'35%',
                                index:0
                        });
                }
                if(self.is_ios_7_plus()){
                        self.calendar_type_bar_of_list.backgroundColor = self.set_table_view_header_backgroundcolor;
                }
                self.top_tool_bar_of_list_container.add(self.calendar_type_bar_of_list);
                
                
                self.status_type_btn_bar_of_list = Ti.UI.createButtonBar({
                        labels:['All '+self.ucfirst(self.current_selected_calendar_type_in_list)+'s'],
                        style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
                        height:30,
                        width:'50%',
                        right:10
                });
                if(self.is_ios_7_plus()){
                        self.status_type_btn_bar_of_list.backgroundColor = self.set_table_view_header_backgroundcolor;
                }                
                self.top_tool_bar_of_list_container.add(self.status_type_btn_bar_of_list);

                //job list
                self.list_table_view = Ti.UI.createTableView({
                        data:[],
                        bottom:self.tool_bar_height,
                        top:self.tool_bar_height,
                        backgroundColor:'#fff',
                        minRowHeight:self.default_table_view_row_height
                });
                self.list_container.add(self.list_table_view);
                //show no result text if query result is null
                self.list_no_result_label = Ti.UI.createLabel({
                        background:'transparent',
                        text:'No Result',
                        color:'#336699',
                        width:'auto',
                        textAlign:'center',
                        zIndex:100,
                        font:{
                                fontSize:20,
                                fontWeight:'bold'
                        }
                });
                self.list_container.add(self.list_no_result_label);

                self.list_table_view.addEventListener('click',function(e){
                        self.table_view_click_event(e);
                });

                self.list_table_view.addEventListener('scroll',function(e){
                        self.table_view_scroll_event(e);
                });

                self.list_table_view.addEventListener('scrollEnd',function(e){
                        self.table_view_scroll_end_event(e);
                });

                self.calendar_type_bar_of_list.addEventListener('click',function(e){
                        self.calendar_type_bar_click_event(e);
                });

                self.status_type_btn_bar_of_list.addEventListener('click',function(e){
                        self.status_type_btn_bar_click_event(e);
                });
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_some_controls_for_list_container');
                return;
        }
};
calendar_page.prototype.calendar_type_bar_click_event = function(e){
        var self = this;
        try{                
                switch(e.index){
                        case 0:
                                self.current_selected_calendar_type_in_list = 'job'; 
                                self.status_type_btn_bar_of_list.labels = [self.current_job_status_name];
                                break;
                        case 1:
                                self.current_selected_calendar_type_in_list = 'quote';
                                self.status_type_btn_bar_of_list.labels = [self.current_quote_status_name];
                                break;
                }                
                self.get_my_job_or_quote_number();                
                self.download_type = self.current_selected_calendar_type_in_list;
                self.show_list(true);
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.calendar_type_bar_click_event');
                return;
        }
};
calendar_page.prototype.status_type_btn_bar_click_event = function(e){
        var self = this;
        try{                
                if(e.index === 0){                        
                        var temp_array = [];
                        var temp_name_array = [];
                        var id_array = [];
                        id_array.push(-1);
                        temp_array.push('All '+self.ucfirst(self.current_selected_calendar_type_in_list)+'s');      
                        temp_name_array.push('All '+self.ucfirst(self.current_selected_calendar_type_in_list)+'s');
                        if(self.current_selected_calendar_type_in_list === 'job'){
                                for(var i=0,j=self.job_status_code_array.length;i<j;i++){
                                        id_array.push(self.job_status_code_array[i].code);
                                        temp_array.push(self.job_status_code_array[i].name);
                                        temp_name_array.push(self.job_status_code_array[i].name);
                                }     
                        }else{
                                for(i=0,j=self.quote_status_code_array.length;i<j;i++){
                                        id_array.push(self.quote_status_code_array[i].code);
                                        temp_array.push(self.quote_status_code_array[i].name);
                                        temp_name_array.push(self.quote_status_code_array[i].name);
                                }                                          
                        }                           
                        
                                                
                        if(temp_array.length > 0){
                                temp_array.push('Cancel');
                                if(self.is_ipad()){
                                        temp_array.push('');
                                }
                                var optionDialog = Ti.UI.createOptionDialog({
                                        options:temp_array,
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:temp_array.length-1,
                                        title:'Please select status.'
                                });
                                optionDialog.show();
                                optionDialog.addEventListener('click',function(evt){
                                        if(evt.index === 0){                                                
                                                if(self.current_selected_calendar_type_in_list === 'job'){                                                             
                                                        self.current_job_status_index = id_array[0];
                                                        self.current_job_status_name = temp_name_array[evt.index];
                                                }else{                                                        
                                                        self.current_quote_status_index = id_array[0];
                                                        self.current_quote_status_name = temp_name_array[evt.index];
                                                }
                                                self.get_my_job_or_quote_number();
                                                self.status_type_btn_bar_of_list.labels = [temp_name_array[evt.index]];                                                
                                                self.show_list(true);
                                        }else{
                                                if(evt.index === temp_array.length-1){
                                                }else{
                                                        if(self.current_selected_calendar_type_in_list === 'job'){
                                                                self.current_job_status_index = id_array[evt.index];
                                                                self.current_job_status_name = temp_name_array[evt.index];
                                                        }else{
                                                                self.current_quote_status_index = id_array[evt.index];
                                                                self.current_quote_status_name = temp_name_array[evt.index];
                                                        }
                                                        self.get_my_job_or_quote_number();
                                                        self.status_type_btn_bar_of_list.labels = [temp_name_array[evt.index]];
                                                        self.show_list(true);
                                                }
                                        }
                                });
                        }
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.status_type_btn_bar_click_event');
                return;
        }
};
/**
 * init calendar view, create components in calendar container
 */
calendar_page.prototype.init_calendar_container = function(){
        var self = this;
        try{
                if((self.calendar_container === undefined)||(self.calendar_container === null)){
                        //init variables
                        self.calendar_data = [];
                        self.init_some_controls_for_calendar_container();
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_calendar_container ');
                return;
        }
};
calendar_page.prototype.init_some_controls_for_calendar_container = function(){
        var self = this;
        try{                
                self.calendar_container = Ti.UI.createView({
                        width:self.screen_width,
                        height:Titanium.UI.currentWindow.height,
                        zIndex:5,
                        top:0
                });
                //Titanium.UI.currentWindow.add(self.calendar_container);
                self.parentView.add(self.calendar_container);
                
                self.top_tool_bar_of_calendar_container = Ti.UI.createView({
                        borderWidth:0,
                        top:0,
                        width:self.screen_width,
                        height:self.tool_bar_height,
                        backgroundColor:self.default_tool_bar_background_color                        
                });
                self.calendar_container.add(self.top_tool_bar_of_calendar_container);                
                
                //init day view component
                //time label
                self.calendar_date_label = Ti.UI.createLabel({
                        text:self.day_list[self.calendar_day]+' '+((self.calendar_date<=9)?'0'+self.calendar_date:self.calendar_date)+'-'+self.month_list[self.calendar_month]+'-'+self.calendar_year,
                        font:{
                                fontSize:18,
                                fontWeight:self.font_weight
                        },
                        color:(self.is_ipad())?'#000':'#fff',
                        textAlign:'center',
                        height:20,
                        width:300,
                        top:5
                });
                self.top_tool_bar_of_calendar_container.add(self.calendar_date_label);
                
                //show jobs number and quotes number
                self.job_and_quote_quantity_for_calendar = Ti.UI.createLabel({
                        text:'Jobs(0)  Quotes(0)',
                        font:{
                                fontSize:12,
                                fontWeight:self.font_weight
                        },
                        color:(self.is_ipad())?'#000':'#fff',
                        textAlign:'center',
                        height:12,
                        width:300,
                        bottom:5
                });
                self.top_tool_bar_of_calendar_container.add(self.job_and_quote_quantity_for_calendar);      
                
                
                //left arrow
                self.calendar_left_btn = Ti.UI.createButton({
                        backgroundImage:self.get_file_path('image','icon/left_arrow_2.png'),
                        width:50,
                        height:30,
                        left:5
                });
                self.top_tool_bar_of_calendar_container.add(self.calendar_left_btn);
                
                //right arrow
                self.calendar_right_btn = Titanium.UI.createButton({
                        width:50,
                        height:30,
                        backgroundImage:self.get_file_path('image','icon/right_arrow_2.png'),
                        right:5
                });
                self.top_tool_bar_of_calendar_container.add(self.calendar_right_btn);

                //scroll view
                self.day_scroll_view  = Titanium.UI.currentWindow.scroll_view_obj;
                self.calendar_container.add(self.day_scroll_view);
                
                //swipe on calendar event
                self.day_scroll_view.addEventListener('swipe',function(e){
                        switch(e.direction){
                                case 'left':
                                        self.calendar_right_btn_click_event();                                        
                                        break;
                                case 'right':
                                        self.calendar_left_btn_click_event();
                                        break;
                        }
                });           
                            
                self.calendar_left_btn.addEventListener('click',function(){
                        self.calendar_left_btn_click_event();
                });

                self.calendar_right_btn.addEventListener('click',function(){
                        self.calendar_right_btn_click_event();
                });
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_some_controls_for_calendar_container');
                return;
        }
};
calendar_page.prototype.calendar_left_btn_click_event = function(){
        var self = this;
        try{
                self.figure_out_date_of_previous_day();
                self.update_and_download_data();
        }catch(err){
                self.hide_indicator();
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.calendar_left_btn_click_event');
                return;
        }
};
calendar_page.prototype.calendar_right_btn_click_event = function(){
        var self = this;
        try{
                self.figure_out_date_of_next_day();
                self.update_and_download_data();        
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.calendar_right_btn_click_event');
                return;
        }
};
/**
 * init day view, create components in day container
 */
calendar_page.prototype.init_day_container = function(){
        var self = this;
        try{
                if((self.day_list_container === undefined)||(self.day_list_container === null)){
                        //init variables
                        self.day_list_data = [];
                        self.init_some_controls_for_day_container();
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_day_container');
                return;
        }
};
calendar_page.prototype.init_some_controls_for_day_container = function(){
        var self = this;
        try{                
                self.day_list_container = Ti.UI.createView({
                        width:self.screen_width,
                        height:Titanium.UI.currentWindow.height,
                        zIndex:4,
                        top:0
                });
                //Titanium.UI.currentWindow.add(self.day_list_container);
                
                self.top_tool_bar_of_day_list_container = Ti.UI.createView({
                        borderWidth:0,
                        top:0,
                        width:self.screen_width,
                        height:self.tool_bar_height,
                        backgroundColor:self.default_tool_bar_background_color                        
                });
                self.day_list_container.add(self.top_tool_bar_of_day_list_container);                    
                
                //init day view component
                //time label
                self.day_list_date_label = Ti.UI.createLabel({
                        text:self.day_list[self.calendar_day]+' '+((self.calendar_date<=9)?'0'+self.calendar_date:self.calendar_date)+'-'+self.month_list[self.calendar_month]+'-'+self.calendar_year,
                        font:{
                                fontSize:18,
                                fontWeight:self.font_weight
                        },
                        color:(self.is_ipad())?'000':'#fff',
                        textAlign:'center',
                        width:300,
                        height:20,
                        top:5
                });
                self.top_tool_bar_of_day_list_container.add(self.day_list_date_label);
                
                
                //show jobs number and quotes number
                self.job_and_quote_quantity_for_day = Ti.UI.createLabel({
                        text:'Jobs(0)  Quotes(0)',
                        font:{
                                fontSize:12,
                                fontWeight:self.font_weight
                        },
                        color:(self.is_ipad())?'000':'#fff',
                        textAlign:'center',
                        height:12,
                        width:300,
                        bottom:5
                });
                self.top_tool_bar_of_day_list_container.add(self.job_and_quote_quantity_for_day);                  
                
                
                //left arrow
                self.day_list_left_btn = Ti.UI.createButton({
                        backgroundImage:self.get_file_path('image','icon/left_arrow_2.png'),
                        width:50,
                        height:30,
                        left:5
                });
                self.top_tool_bar_of_day_list_container.add(self.day_list_left_btn);
                //right arrow
                self.day_list_right_btn = Titanium.UI.createButton({
                        width:50,
                        height:30,
                        backgroundImage:self.get_file_path('image','icon/right_arrow_2.png'),
                        right:5
                });
                self.top_tool_bar_of_day_list_container.add(self.day_list_right_btn);

                //job list
                self.day_list_table_view = Ti.UI.createTableView({
                        data:[],
                        top:self.tool_bar_height,
                        bottom:self.tool_bar_height,
                        backgroundColor:'#fff',
                        minRowHeight:self.default_table_view_row_height
                });
                self.day_list_container.add(self.day_list_table_view);

                //show no result text if query result is null
                self.day_list_no_result_label = Ti.UI.createLabel({
                        background:'transparent',
                        text:'No Result',
                        color:'#336699',
                        width:100,
                        textAlign:'center',
                        zIndex:100,
                        left:self.screen_width/2-50,
                        height:30,
                        font:{
                                fontSize:20,
                                fontWeight:'bold'
                        }
                });
                self.day_list_container.add(self.day_list_no_result_label);

                self.day_list_table_view.addEventListener('click',function(e){
                        self.table_view_click_event(e);
                });

                self.day_list_table_view.addEventListener('scroll',function(e){
                        self.table_view_scroll_event(e);
                });

                self.day_list_table_view.addEventListener('scrollEnd',function(e){
                        self.table_view_scroll_end_event(e);
                });

                self.day_list_left_btn.addEventListener('click',function(){
                        self.day_list_left_btn_click_event();
                });

                self.day_list_right_btn.addEventListener('click',function(){
                        self.day_list_right_btn_click_event();
                });
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_some_controls_for_day_container');
                return;
        }
};
calendar_page.prototype.day_list_left_btn_click_event = function(){
        var self = this;
        try{
                self.figure_out_date_of_previous_day();
                self.update_and_download_data();
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.day_list_left_btn_click_event');
                return;
        }
};
calendar_page.prototype.day_list_right_btn_click_event = function(){
        var self = this;
        try{
                self.figure_out_date_of_next_day();
                self.update_and_download_data();
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.day_list_right_btn_click_event');
                return;
        }
};
/**
 * init week view, create components in week container
 */
calendar_page.prototype.init_week_container = function(){
        var self = this;
        try{
                if((self.week_container === undefined)||(self.week_container === null)){
                        self.week_data = [];
                        self.init_some_controls_for_week_container();
                        self.init_week_day_control_for_week_container();
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_week_container');
                return;
        }
};
calendar_page.prototype.init_some_controls_for_week_container = function(){
        var self = this;
        try{
                self.week_container = Ti.UI.createView({
                        width:self.screen_width,
                        height:Titanium.UI.currentWindow.height,
                        zIndex:2,
                        top:0
                });
                //Titanium.UI.currentWindow.add(self.week_container);

                self.week_navigation_view = Ti.UI.createView({
                        borderWidth:0,
                        top:0,
                        width:self.screen_width,
                        height:self.tool_bar_height,
                        backgroundColor:self.default_tool_bar_background_color//self.tool_bar_background_color
                });
                self.week_container.add(self.week_navigation_view);

                self.week_view = Ti.UI.createView({
                        top:self.tool_bar_height,
                        width:self.screen_width,
                        height:(self.avg_width-8),
                        backgroundColor:self.default_tool_bar_background_color,//self.tool_bar_background_color,
                        className:'week'
                });
                self.week_container.add(self.week_view);
                
                self.init_week_name_for_week_container();

                self.week_date_label = Ti.UI.createLabel({
                        width:self.screen_width-self.avg_width*2,
                        height:self.font_size,
                        text:'Week',
                        textAlign:'center',
                        font:{
                                fontSize:self.font_size,
                                fontWeight:self.font_weight
                        },
                        color:self.calendar_font_color,
                        top:5
                });
                self.week_navigation_view.add(self.week_date_label);

                self.week_left_btn = Ti.UI.createButton({
                        backgroundImage:self.get_file_path('image','icon/left_arrow_2.png'),
                        width:self.is_ipad()?50:45,
                        height:self.is_ipad()?30:27,
                        left:3,
                        top:3
                });
                self.week_navigation_view.add(self.week_left_btn);

                self.week_right_btn = Ti.UI.createButton({
                        backgroundImage:self.get_file_path('image','icon/right_arrow_2.png'),
                        width:self.is_ipad()?50:45,
                        height:self.is_ipad()?30:27,
                        right:3,
                        top:3
                });
                self.week_navigation_view.add(self.week_right_btn);


                self.week_table_view = Ti.UI.createTableView({
                        data:[],
                        bottom:self.tool_bar_height,
                        top:0,
                        backgroundColor:'#fff',
                        minRowHeight:self.default_table_view_row_height
                });
                self.week_container.add(self.week_table_view);

                //show no result text if query result is null
                self.week_no_result_label = Ti.UI.createLabel({
                        background:'transparent',
                        text:'No Result',
                        color:'#336699',
                        width:100,
                        textAlign:'center',
                        zIndex:100,
                        left:self.screen_width/2-50,
                        height:30,
                        font:{
                                fontSize:20,
                                fontWeight:'bold'
                        }
                });
                self.week_container.add(self.week_no_result_label);

                self.week_left_btn.addEventListener('click',function(){
                        self.week_left_btn_click_event();
                });

                self.week_right_btn.addEventListener('click',function(){
                        self.week_right_btn_click_event();
                });

                self.week_table_view.addEventListener('click',function(e){
                        self.table_view_click_event(e);
                });

                self.week_table_view.addEventListener('scroll',function(e){
                        self.table_view_scroll_event(e);
                });

                self.week_table_view.addEventListener('scrollEnd',function(e){
                        self.table_view_scroll_end_event(e);
                });               
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_some_controls_for_week_container');
                return;
        }
};
calendar_page.prototype.init_week_name_for_week_container = function(){
        var self = this;
        try{
                var i= 0;
                //monday
                self.week_name_label_monday_for_week = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:'#fff',
                        textAlign:'center',
                        top:28
                });
                self.week_navigation_view.add(self.week_name_label_monday_for_week);       
                i++;
                //tuesday
                self.week_name_label_tuesday_for_week = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:'#fff',
                        textAlign:'center',
                        top:28
                });
                self.week_navigation_view.add(self.week_name_label_tuesday_for_week);       
                i++;  
                //wednesday
                self.week_name_label_wednesday_for_week = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:'#fff',
                        textAlign:'center',
                        top:28
                });
                self.week_navigation_view.add(self.week_name_label_wednesday_for_week);       
                i++;  
                //thursday
                self.week_name_label_thursday_for_week = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:'#fff',
                        textAlign:'center',
                        top:28
                });
                self.week_navigation_view.add(self.week_name_label_thursday_for_week);       
                i++;  
                //friday
                self.week_name_label_friday_for_week = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:'#fff',
                        textAlign:'center',
                        top:28
                });
                self.week_navigation_view.add(self.week_name_label_friday_for_week);       
                i++;  
                //saturday
                self.week_name_label_saturday_for_week = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:'#fff',
                        textAlign:'center',
                        top:28
                });
                self.week_navigation_view.add(self.week_name_label_saturday_for_week);       
                i++;  
                //sunday
                self.week_name_label_sunday_for_week = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:'#fff',
                        textAlign:'center',
                        top:28
                });
                self.week_navigation_view.add(self.week_name_label_sunday_for_week);              
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_week_name_for_week_container');
                return;
        }
};
calendar_page.prototype.init_week_day_control_for_week_container = function(){
        var self = this;
        try{
                //display date of week
                for(var i=0;i<1;i++){
                        for(var j=0;j<7;j++){
                                var c_w_view = Ti.UI.createView({
                                        borderColor:'fff',//'#E0E1E5',
                                        borderWidth:1,
                                        left:j*self.avg_width,
                                        top:(i===0)?0:(i*(self.avg_width-8)),
                                        width:self.avg_width,
                                        height:self.avg_width-8,
                                        is_has_job:false,
                                        backgroundColor:self.default_tool_bar_background_color,//self.tool_bar_background_color,
                                        date_string:'',
                                        job_list:[],
                                        is_current_week:false,
                                        filterClass:'parent_control'
                                });
                                self.week_view.add(c_w_view);
                                var c_w_label = Ti.UI.createLabel({
                                        text:' ',
                                        textAlign:'center',
                                        width:self.avg_width,
                                        height:self.avg_width-8,
                                        font:{
                                                fontSize:(self.is_ipad()?18:self.font_size),
                                                fontWeight:self.font_weight
                                        },
                                        color:self.calendar_font_color,
                                        filterClass:'child_control'
                                });
                                c_w_view.add(c_w_label);
                                var c_w_circle = Ti.UI.createButton({
                                        width:5,
                                        height:5,
                                        backgroundImage: 'NONE',
                                        borderRadius:3,
                                        bottom:(self.is_ipad())?self.avg_width/5:3,
                                        left:(self.avg_width/2)-2.5,
                                        backgroundColor: self.default_tool_bar_background_color,//self.tool_bar_background_color,
                                        filterClass:'child_control'
                                });
                                c_w_view.add(c_w_circle);
                                c_w_view.addEventListener('click',function(){
                                        return function(e){                                             
                                                try{
                                                        self.current_day_data_of_week = [];
                                                        var temp_week_view_obj = null;
                                                        if(e.source.filterClass === 'child_control'){
                                                                temp_week_view_obj = e.source.parent;
                                                        }else{
                                                                temp_week_view_obj = e.source;
                                                        }
                                                        if(!temp_week_view_obj.is_current_week){
                                                                return;
                                                        }
                                                        if(temp_week_view_obj.date_string === undefined){
                                                                return;
                                                        }
                                                        var startDateValue = self.get_seconds_value_by_time_string(temp_week_view_obj.date_string+' 00:00:00');
                                                        startDateValue = new Date(startDateValue*1000);
                                                        self.calendar_year = startDateValue.getFullYear();
                                                        self.calendar_month = startDateValue.getMonth();
                                                        self.calendar_date = startDateValue.getDate();
                                                        self.calendar_day = startDateValue.getDay();
                                                        if(Ti.Network.online){
                                                                self.update_and_download_data(); 
                                                        }else{
                                                                //get data
                                                                
                                                                var temp_start_value = self.calendar_year+'-'+((self.calendar_month+1)<=9?'0'+(self.calendar_month+1):(self.calendar_month+1))+'-'+((self.calendar_date)<=9?'0'+(self.calendar_date):(self.calendar_date))+' 00:00:00';
                                                                var temp_end_value = self.calendar_year+'-'+((self.calendar_month+1)<=9?'0'+(self.calendar_month+1):(self.calendar_month+1))+'-'+((self.calendar_date)<=9?'0'+(self.calendar_date):(self.calendar_date))+' 23:59:59';                                                        
                                                                self.current_day_data_of_week = [];
                                                                var db = Titanium.Database.open(self.get_db_name());
                                                                self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'job',temp_start_value,temp_end_value,0);
                                                                self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'quote',temp_start_value,temp_end_value,self.current_day_data_of_week.length);
                                                                db.close();  
                                                                for(var m=0,n=self.current_day_data_of_week.length;m<n;m++){
                                                                        if(m%2 === 0){
                                                                                self.current_day_data_of_week[m].backgroundColor = self.job_list_row_background_color;
                                                                        }else{
                                                                                self.current_day_data_of_week[m].backgroundColor = '#fff';
                                                                        }
                                                                }                                                        
                                                                                                                                                                                                                                
                                                                if(self.pre_selected_week_btn != null){
                                                                        self.pre_selected_week_btn.backgroundColor = self.tool_bar_background_color;
                                                                        self.pre_selected_week_btn.children[0].color = self.calendar_font_color;
                                                                        if(self.pre_selected_week_btn.is_has_job){
                                                                                self.pre_selected_week_btn.children[1].backgroundColor = '#fff';
                                                                        }else{
                                                                                self.pre_selected_week_btn.children[1].backgroundColor = self.tool_bar_background_color;
                                                                        }
                                                                }
                                                                temp_week_view_obj.backgroundColor = 'blue';
                                                                temp_week_view_obj.children[0].color = '#fff';
                                                                if(temp_week_view_obj.is_has_job){
                                                                        temp_week_view_obj.children[1].backgroundColor = '#fff';
                                                                }else{
                                                                        temp_week_view_obj.children[1].backgroundColor = 'blue';
                                                                }
                                                                self.pre_selected_week_btn = temp_week_view_obj;
                                                                self.week_table_view.data = self.current_day_data_of_week;
                                                                if(self.current_day_data_of_week.length > 0){
                                                                        self.week_no_result_label.visible = false;
                                                                }else{
                                                                        self.week_no_result_label.visible = true;
                                                                }
                                                        }
                                                }catch(err){
                                                        self.process_simple_error_message(err,self.window_source+' - init');
                                                }
                                        };
                                }());
                        }
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_week_day_control_for_week_container');
                return;
        }
};
calendar_page.prototype.week_left_btn_click_event = function(){
        var self = this;
        try{
                self.calendar_date = self.calendar_date-7;
                if(self.calendar_date < 0){
                        self.calendar_month--;
                        if(self.calendar_month <0){
                                self.calendar_month = 11;
                                self.calendar_year--;
                        }
                        var day_of_months = self.days_number_of_month(self.calendar_year,self.calendar_month);
                        self.calendar_date = day_of_months+self.calendar_date;
                }
                self.update_and_download_data(); 
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.week_left_btn_click_event');
                return;
        }
};
calendar_page.prototype.week_right_btn_click_event = function(){
        var self = this;
        try{
                self.calendar_date = self.calendar_date+7;
                var day_of_months = self.days_number_of_month(self.calendar_year,self.calendar_month);
                if(self.calendar_date > day_of_months){
                        self.calendar_month++;
                        if(self.calendar_month >11){
                                self.calendar_month = 0;
                                self.calendar_year++;
                        }
                        self.calendar_date = self.calendar_date - day_of_months;
                }
                self.update_and_download_data();
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.week_right_btn_click_event');
                return;
        }
};
/**
 * init month view, create components in month container
 */
calendar_page.prototype.init_month_container = function(){
        var self = this;
        try{
                if((self.month_container === undefined)||(self.month_container === null)){
                        self.month_data = [];
                        self.init_some_controls_for_month_container();
                        self.init_month_day_control_for_month_container();
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_month_container');
                return;
        }
};
calendar_page.prototype.init_some_controls_for_month_container = function(){
        var self = this;
        try{                
                self.month_container = Ti.UI.createView({
                        width:self.screen_width,
                        height:Titanium.UI.currentWindow.height,
                        zIndex:1,
                        top:0
                });
                //Titanium.UI.currentWindow.add(self.month_container);

                self.month_view = Ti.UI.createView({
                        top:self.tool_bar_height,
                        width:self.screen_width,
                        height:6*(self.avg_width-8),
                        backgroundColor:self.default_tool_bar_background_color//self.tool_bar_background_color
                });
                self.month_container.add(self.month_view);

                self.month_navigation_view = Ti.UI.createView({
                        //borderColor:'#fff',//'#E0E1E5',
                        borderWidth:0,
                        top:0,
                        width:self.screen_width,
                        height:self.tool_bar_height,
                        backgroundColor:self.default_tool_bar_background_color//self.tool_bar_background_color
                });
                self.month_container.add(self.month_navigation_view);

                self.month_date_label = Ti.UI.createLabel({
                        width:self.screen_width-self.avg_width*2,
                        height:self.font_size,
                        text:'',
                        textAlign:'center',
                        font:{
                                fontSize:self.font_size,
                                fontWeight:self.font_weight
                        },
                        color:self.calendar_font_color,
                        top:5
                });
                self.month_navigation_view.add(self.month_date_label);

                self.month_left_btn = Ti.UI.createButton({
                        backgroundImage:self.get_file_path('image','icon/left_arrow_2.png'),
                        width:self.is_ipad()?50:45,
                        height:self.is_ipad()?30:27,
                        left:3,
                        top:3
                });
                self.month_navigation_view.add(self.month_left_btn);

                self.month_right_btn = Ti.UI.createButton({
                        backgroundImage:self.get_file_path('image','icon/right_arrow_2.png'),
                        width:self.is_ipad()?50:45,
                        height:self.is_ipad()?30:27,
                        right:3,
                        top:3
                });
                self.month_navigation_view.add(self.month_right_btn);
                
                self.init_week_name_for_month_container();

                self.month_table_view = Ti.UI.createTableView({
                        data:[],
                        bottom:self.tool_bar_height,
                        top:0,
                        backgroundColor:'#fff',
                        minRowHeight:self.default_table_view_row_height
                });
                self.month_container.add(self.month_table_view);

                //show no result text if query result is null
                self.month_no_result_label = Ti.UI.createLabel({
                        background:'transparent',
                        text:'No Result',
                        color:'#336699',
                        width:100,
                        textAlign:'center',
                        zIndex:100,
                        top:6.5*self.avg_width,
                        left:self.screen_width/2-50,
                        height:30,
                        font:{
                                fontSize:20,
                                fontWeight:'bold'
                        }
                });
                self.month_container.add(self.month_no_result_label);

                self.month_left_btn.addEventListener('click',function(e){
                        self.month_left_btn_click_event();
                });

                self.month_right_btn.addEventListener('click',function(){
                        self.month_right_btn_click_event();
                });

                self.month_table_view.addEventListener('click',function(e){
                        self.table_view_click_event(e);
                });

                self.month_table_view.addEventListener('scroll',function(e){
                        self.table_view_scroll_event(e);
                });

                self.month_table_view.addEventListener('scrollEnd',function(e){
                        self.table_view_scroll_end_event(e);
                });
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_some_controls_for_month_container');
                return;
        }
};
calendar_page.prototype.init_week_name_for_month_container = function(){
        var self = this;
        try{
                var i= 0;
                //monday
                self.week_name_label_monday_for_month = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:self.calendar_font_color,
                        textAlign:'center',
                        top:28
                });
                self.month_navigation_view.add(self.week_name_label_monday_for_month);       
                i++;
                //tuesday
                self.week_name_label_tuesday_for_month = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:self.calendar_font_color,
                        textAlign:'center',
                        top:28
                });
                self.month_navigation_view.add(self.week_name_label_tuesday_for_month);       
                i++;  
                //wednesday
                self.week_name_label_wednesday_for_month = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:self.calendar_font_color,
                        textAlign:'center',
                        top:28
                });
                self.month_navigation_view.add(self.week_name_label_wednesday_for_month);       
                i++;  
                //thursday
                self.week_name_label_thursday_for_month = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:self.calendar_font_color,
                        textAlign:'center',
                        top:28
                });
                self.month_navigation_view.add(self.week_name_label_thursday_for_month);       
                i++;  
                //friday
                self.week_name_label_friday_for_month = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:self.calendar_font_color,
                        textAlign:'center',
                        top:28
                });
                self.month_navigation_view.add(self.week_name_label_friday_for_month);       
                i++;  
                //saturday
                self.week_name_label_saturday_for_month = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:self.calendar_font_color,
                        textAlign:'center',
                        top:28
                });
                self.month_navigation_view.add(self.week_name_label_saturday_for_month);       
                i++;  
                //sunday
                self.week_name_label_sunday_for_month = Ti.UI.createLabel({
                        text:self.calendar_week_name_abbr_list[i],
                        width:self.avg_width,
                        height:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                        left:i*self.avg_width,
                        font:{
                                fontSize:(self.is_ipad())?self.middle_font_size:self.small_font_size,
                                fontWeight:self.font_weight
                        },
                        color:self.calendar_font_color,
                        textAlign:'center',
                        top:28
                });
                self.month_navigation_view.add(self.week_name_label_sunday_for_month);              
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_week_name_for_month_container ');
                return;
        }
};
calendar_page.prototype.init_month_day_control_for_month_container = function(){
        var self = this;
        try{                
                //display date of month
                for(var i=0;i<6;i++){
                        for(var j=0;j<7;j++){
                                var c_m_view = Ti.UI.createView({
                                        borderColor:'#fff',//'#E0E1E5',
                                        borderWidth:1,
                                        left:j*self.avg_width,
                                        top:(i===0)?0:(i*(self.avg_width-8)),
                                        width:self.avg_width,
                                        height:self.avg_width-8,
                                        is_has_job:false,
                                        backgroundColor:self.default_tool_bar_background_color,//self.tool_bar_background_color,
                                        date_string:'',
                                        job_list:[],
                                        is_current_month:false,
                                        filterClass:'parent_control'
                                });
                                self.month_view.add(c_m_view);
                                var c_m_label = Ti.UI.createLabel({
                                        text:' ',
                                        textAlign:'center',
                                        width:self.avg_width,
                                        height:self.avg_width-8,
                                        font:{
                                                fontSize:(self.is_ipad()?18:self.font_size),
                                                fontWeight:self.font_weight
                                        },
                                        color:self.calendar_font_color,
                                        filterClass:'child_control'
                                });
                                c_m_view.add(c_m_label);
                                var c_m_circle = Ti.UI.createButton({
                                        width:5,
                                        height:5,
                                        backgroundImage: 'NONE',
                                        borderRadius:3,
                                        bottom:(self.is_ipad())?self.avg_width/5:3,
                                        left:(self.avg_width/2)-2.5,
                                        backgroundColor: self.default_tool_bar_background_color,//self.tool_bar_background_color,
                                        filterClass:'child_control'
                                });
                                c_m_view.add(c_m_circle);
                                c_m_view.addEventListener('click',function(){
                                        return function(e){
                                                try{
                                                        var temp_month_view_obj = null;
                                                        if(e.source.filterClass === 'child_control'){
                                                                temp_month_view_obj = e.source.parent;
                                                        }else{
                                                                temp_month_view_obj = e.source;
                                                        }
                                                        if(!temp_month_view_obj.is_current_month){
                                                                return;
                                                        }
                                                        if(temp_month_view_obj.date_string === undefined){
                                                                return;
                                                        }
                                                        var startDateValue = self.get_seconds_value_by_time_string(temp_month_view_obj.date_string+' 00:00:00');
                                                        startDateValue = new Date(startDateValue*1000);
                                                        self.calendar_year = startDateValue.getFullYear();
                                                        self.calendar_month = startDateValue.getMonth();
                                                        self.calendar_date = startDateValue.getDate();
                                                        self.calendar_day = startDateValue.getDay();
                                                        
                                                        if(Ti.Network.online){
                                                                self.update_and_download_data(); 
                                                        }else{
                                                                //get data
                                                                var db = Titanium.Database.open(self.get_db_name());
                                                                var temp_start_value = self.calendar_year+'-'+((self.calendar_month+1)<=9?'0'+(self.calendar_month+1):(self.calendar_month+1))+'-'+((self.calendar_date)<=9?'0'+(self.calendar_date):(self.calendar_date))+' 00:00:00';
                                                                var temp_end_value = self.calendar_year+'-'+((self.calendar_month+1)<=9?'0'+(self.calendar_month+1):(self.calendar_month+1))+'-'+((self.calendar_date)<=9?'0'+(self.calendar_date):(self.calendar_date))+' 23:59:59';                                                        
                                                                self.current_day_data_of_month = [];
                                                                self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'job',temp_start_value,temp_end_value,0);
                                                                self.get_job_or_quote_data_by_assigned_from_is_not_null(db,'quote',temp_start_value,temp_end_value,self.current_day_data_of_month.length);
                                                                db.close(); 
                                                                for(var m=0,n=self.current_day_data_of_month.length;m<n;m++){
                                                                        if(m%2 === 0){
                                                                                self.current_day_data_of_month[m].backgroundColor = self.job_list_row_background_color;
                                                                        }else{
                                                                                self.current_day_data_of_month[m].backgroundColor = '#fff';
                                                                        }
                                                                }                                                        

                                                                if(self.pre_selected_month_btn != null){
                                                                        self.pre_selected_month_btn.backgroundColor = self.tool_bar_background_color;
                                                                        self.pre_selected_month_btn.children[0].color = self.calendar_font_color;
                                                                        if(self.pre_selected_month_btn.is_has_job){
                                                                                self.pre_selected_month_btn.children[1].backgroundColor = '#fff';
                                                                        }else{
                                                                                self.pre_selected_month_btn.children[1].backgroundColor = self.default_tool_bar_background_color;//self.tool_bar_background_color;
                                                                        }
                                                                }
                                                                temp_month_view_obj.backgroundColor = 'blue';
                                                                temp_month_view_obj.children[0].color = '#fff';
                                                                if(temp_month_view_obj.is_has_job){
                                                                        temp_month_view_obj.children[1].backgroundColor = '#fff';
                                                                }else{
                                                                        temp_month_view_obj.children[1].backgroundColor = 'blue';
                                                                }
                                                                self.pre_selected_month_btn = temp_month_view_obj;
                                                                self.month_table_view.data = self.current_day_data_of_month;
                                                                if(self.current_day_data_of_month.length >0){
                                                                        self.month_no_result_label.visible = false;
                                                                }else{
                                                                        self.month_no_result_label.visible = true;
                                                                }
                                                        }
                                                }catch(err){
                                                        self.process_simple_error_message(err,self.window_source+' - init');
                                                }
                                        };
                                }());
                        }
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.init_month_day_control_for_month_container');
                return;
        }
};
calendar_page.prototype.month_left_btn_click_event = function(){
        var self = this;
        try{
                self.calendar_date = 1;
                self.calendar_month--;
                if(self.calendar_month < 0){
                        self.calendar_month = 11;
                        self.calendar_year--;
                }
                self.update_and_download_data();
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.month_left_btn_click_event');
                return;
        }
};
calendar_page.prototype.month_right_btn_click_event = function(){
        var self = this;
        try{
                self.calendar_date = 1;
                self.calendar_month++;
                if(self.calendar_month > 11){
                        self.calendar_month = 0;
                        self.calendar_year++;
                }
                self.update_and_download_data();
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.month_right_btn_click_event ');
                return;
        }
};


calendar_page.prototype.get_job_or_quote_data_by_assigned_from_is_not_null= function(db,temp_job_type,temp_start_value,temp_end_value,b){
        var self = this;
        try{
                var sql_params ={
                        is_task:false,
                        is_calendar:true,//in calendar or in filter
                        is_scheduled:true,//query assigned_from is not null
                        is_check_changed:false,//check changed field or not
                        is_check_self_job:true,//only check current user's job
                        order_by:'my_'+temp_job_type+'_assigned_user.assigned_from asc',
                        is_search:false,
                        search_string:'',
                        extra_left_join_condition:
                        '('+
                        '(my_'+temp_job_type+'_assigned_user.assigned_from <=\''+temp_end_value+'\' and my_'+temp_job_type+'_assigned_user.assigned_to >=\''+temp_start_value+'\') or '+
                        '(my_'+temp_job_type+'_assigned_user.assigned_from <=\''+temp_end_value+'\' and my_'+temp_job_type+'_assigned_user.assigned_to >=\''+temp_end_value+'\') or '+
                        '(my_'+temp_job_type+'_assigned_user.assigned_from >=\''+temp_start_value+'\' and my_'+temp_job_type+'_assigned_user.assigned_from <=\''+temp_end_value+'\') '+
                        ')',
                        extra_where_condition:'',
                        type:temp_job_type,
                        user_id:self.selected_user_id,
                        company_id:self.selected_company_id,
                        job_status_code:-1
                };
                var sql = self.setup_sql_query_for_display_job_list(sql_params);
                var rows = db.execute(sql);
                var x = 0;
                if(temp_job_type === 'job'){
                        self.my_selected_job_number = rows.getRowCount();
                }else{
                        self.my_selected_quote_number = rows.getRowCount();
                }
                if(rows.getRowCount() > 0){
                        while(rows.isValidRow()){
                                var status_colour = '';
                                var status_name = '';
                                var status_description = '';
                                if(temp_job_type === 'job'){                                        
                                        for(var i=0,j=self.job_status_code_array.length;i<j;i++){
                                                if(self.job_status_code_array[i].code == rows.fieldByName(temp_job_type+'_status_code')){
                                                        status_colour = self.job_status_code_array[i].colour;
                                                        status_name  = self.job_status_code_array[i].name;
                                                        status_description  = self.job_status_code_array[i].description;
                                                        break;
                                                }
                                        }     
                                }else{
                                        
                                        for(i=0,j=self.quote_status_code_array.length;i<j;i++){
                                                if(self.quote_status_code_array[i].code == rows.fieldByName(temp_job_type+'_status_code')){
                                                        status_colour = self.quote_status_code_array[i].colour;
                                                        status_name  = self.quote_status_code_array[i].name;
                                                        status_description  = self.quote_status_code_array[i].description;
                                                        break;
                                                }
                                        }                                          
                                }                                    
                                
                                var temp_date_value = self.get_seconds_value_by_time_string(rows.fieldByName('assigned_from'));
                                temp_date_value = new Date(temp_date_value*1000);
                                var temp_hours = temp_date_value.getHours();
                                var temp_minutes = temp_date_value.getMinutes();

                                var assigned_to_hours = '';
                                var assigned_to_minutes = '';
                                if((rows.fieldByName('assigned_to') != undefined) && (rows.fieldByName('assigned_to') != null) && (rows.fieldByName('assigned_to') != '')){
                                        var assigned_to_temp_date_value = self.get_seconds_value_by_time_string(rows.fieldByName('assigned_to'));
                                        assigned_to_temp_date_value = new Date(assigned_to_temp_date_value*1000);
                                        assigned_to_hours = assigned_to_temp_date_value.getHours();
                                        assigned_to_minutes = assigned_to_temp_date_value.getMinutes();
                                }
                                var params = {
                                        is_header:(x===0)?true:false,
                                        header_text:self.ucfirst_for_each(temp_job_type),
                                        job_type:temp_job_type,
                                        job_title:rows.fieldByName('title'),
                                        job_id:rows.fieldByName('id'),
                                        job_reference_number:rows.fieldByName('reference_number'),
                                        job_status_code:rows.fieldByName(temp_job_type+'_status_code'),
                                        class_name:'show_'+temp_job_type+'_row_'+b,
                                        assigned_from_hours:temp_hours,
                                        assigned_from_minutes:temp_minutes,
                                        assigned_to_hours:assigned_to_hours,
                                        assigned_to_minutes:assigned_to_minutes,
                                        job_status_color:status_colour,
                                        job_status_name:status_name,
                                        job_status_description:status_description,
                                        sub_number:rows.fieldByName('sub_number'),
                                        unit_number:rows.fieldByName('unit_number'),
                                        street_number:rows.fieldByName('street_number'),
                                        street:rows.fieldByName('street'),
                                        street_type:rows.fieldByName('street_type'),
                                        suburb:rows.fieldByName('suburb'),
                                        postcode:rows.fieldByName('postcode')
                                };                                 
                                switch(self.view_name){
                                        case 'day':
                                                self.day_list_data.push(self.setup_job_row_for_job_list(params)); 
                                                break;
                                        case 'week':
                                                self.current_day_data_of_week.push(self.setup_job_row_for_job_list(params));
                                                break;
                                        case 'month':
                                                self.current_day_data_of_month.push(self.setup_job_row_for_job_list(params));
                                                break;
                                }
                                x++;
                                b++;
                                rows.next();                       
                        }
                }
                rows.close();
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.get_job_or_quote_data_by_assigned_from_is_not_null');
                return [];
        }  
};
/**
 *  in day and calendar page, click left arrow button and go to previous day
 */
calendar_page.prototype.figure_out_date_of_previous_day = function(){
        var self = this;
        try{
                self.calendar_date--;
                self.calendar_day--;
                if(self.calendar_day <0){
                        self.calendar_day = 6;
                }
                if(self.calendar_date <= 0){
                        self.calendar_month--;
                        if(self.calendar_month < 0){
                                self.calendar_month = 11;
                                self.calendar_year--;
                        }
                        self.calendar_date = self.days_number_of_month(self.calendar_year,self.calendar_month);
                }                
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.figure_out_date_of_previous_day');
                return;
        }
};
/**
 *  in day and calendar page, click left arrow button and go to previous day
 */
calendar_page.prototype.figure_out_date_of_next_day = function(){
        var self = this;
        try{
                self.calendar_date++;
                self.calendar_day++;
                if(self.calendar_day > 6){
                        self.calendar_day = 0;
                }
                var daysNum = self.days_number_of_month(self.calendar_year,self.calendar_month);
                if(self.calendar_date > daysNum){
                        self.calendar_date -= daysNum;
                        self.calendar_month++;
                        if(self.calendar_month > 11){
                                self.calendar_month = 0;
                                self.calendar_year++;
                        }
                }            
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.figure_out_date_of_next_day');
                return;
        }
};
/*
 * set calendar row
 */
calendar_page.prototype.set_calendar_row = function(rows,startDateValue,endDateValue,job_type){
        var self = this;
        try{
                var is_all_day = false;
                var is_only_scheduled_from = false;
                var scheduled_from_hours = 0;
                var scheduled_from_minutes = 0;
                var scheduled_to_hours = 0;
                var scheduled_to_minutes = 0;
                var scheduled_from_value = 0;
                var scheduled_to_value = 0;
                var scheduled_from_obj = null;
                var scheduled_to_obj = null;
                if(rows.fieldByName('assigned_from') != null){
                        scheduled_from_value = self.get_seconds_value_by_time_string(rows.fieldByName('assigned_from'));
                        scheduled_from_obj = new Date(scheduled_from_value*1000);
                }
                if(rows.fieldByName('assigned_to') != null){
                        scheduled_to_value = self.get_seconds_value_by_time_string(rows.fieldByName('assigned_to'));
                        scheduled_to_obj = new Date(scheduled_to_value*1000);
                }else{
                        is_only_scheduled_from = true;
                }
                if((scheduled_from_value <= startDateValue)&&(scheduled_to_value>=endDateValue)){
                        is_all_day = true;
                }else{
                        if(!is_only_scheduled_from){
                                if((scheduled_from_value >=startDateValue)&&(scheduled_from_value<=endDateValue)){
                                        if(scheduled_from_obj != null){
                                                scheduled_from_hours = scheduled_from_obj.getHours();
                                                scheduled_from_minutes = scheduled_from_obj.getMinutes();
                                        }
                                }
                                if((scheduled_to_value >=startDateValue)&&(scheduled_to_value<=endDateValue)){
                                        if(scheduled_to_obj != null){
                                                scheduled_to_hours = scheduled_to_obj.getHours();
                                                scheduled_to_minutes = scheduled_to_obj.getMinutes();
                                        }
                                }
                        }else{
                                if(scheduled_from_obj != null){
                                        scheduled_from_hours = scheduled_from_obj.getHours();
                                        scheduled_from_minutes = scheduled_from_obj.getMinutes();
                                }
                        }
                }

                var sub_number = rows.fieldByName('sub_number');
                var unit = rows.fieldByName('unit_number');
                if((unit === '')||(unit === null)){
                        unit = '';
                }else{
                        if((sub_number === '') || (sub_number === null)){
                                unit = unit+'/';
                        }else{
                                unit = unit+'-'+sub_number+'/';
                        }
                }

                var street_no = rows.fieldByName('street_number');
                street_no = ((street_no === '')||(street_no === null))?'':street_no;

                var street_type = rows.fieldByName('street_type');
                var street = (rows.fieldByName('street') === null)?'':self.trim(rows.fieldByName('street'));
                street = self.display_correct_street(street,street_type);
                var suburb = rows.fieldByName('suburb');
                suburb = (suburb === null)?'':suburb;
                
                var postcode = rows.fieldByName('postcode');
                postcode = (postcode === null)?'':postcode;               
                
                var address = '';
                if(street === ''){
                        address = '(Blank)';
                }else{
                        address = unit+street_no+' '+street+', '+suburb+(postcode===''?'':' '+postcode);
                }

                var temp_var = {
                        job_type:job_type,
                        job_id:rows.fieldByName('id'),
                        job_reference_number:rows.fieldByName('reference_number'),
                        job_title:rows.fieldByName('title'),
                        job_description:rows.fieldByName('description'),
                        job_status_code:rows.fieldByName(job_type+'_status_code'),
                        address:address,
                        scheduled_from:rows.fieldByName('assigned_from'),
                        scheduled_to:rows.fieldByName('assigned_to'),
                        is_all_day:is_all_day,
                        is_only_scheduled_from:is_only_scheduled_from,
                        scheduled_from_hours:scheduled_from_hours,
                        scheduled_from_minutes:scheduled_from_minutes,
                        scheduled_to_hours:scheduled_to_hours,
                        scheduled_to_minutes:scheduled_to_minutes,
                        in_same_column:false
                };
                self.calendar_data.push(temp_var);
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.set_calendar_row');
                return;
        }
};
/**
 *  get job extra condition when query more jobs
 */
calendar_page.prototype.get_extra_conditions_when_download_more_jobs = function(){
        var self = this;
        try{
                
                if(self.view_name === 'list'){
                        if((self.current_selected_calendar_type_in_list === 'job') && (self.current_job_status_index > -1)){
                                self.job_extra_where = 'j.job_status_code='+self.current_job_status_index;
                        }
                        if((self.current_selected_calendar_type_in_list === 'quote') && (self.current_quote_status_index > -1)){
                                self.job_extra_where = 'j.quote_status_code='+self.current_quote_status_index;
                        }
                }                
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.get_extra_conditions_when_download_more_jobs');
                return;
        }
};
/**
 *  scoll down table view and end download more jobs
 */
calendar_page.prototype.end_download_more_jobs_by_scroll_down = function(is_hide_indicator){
        var self = this;
        try{
                self.pulling = false;
                self.downloading = false; 
                self.contentOffset_y = 0;
                if(self.view_name === 'list'){
                        self.list_table_view.headerPullView.children[2].text = "Pull down to download ...";
                        self.list_table_view.headerPullView.children[1].show();                                 
                        self.list_table_view.setContentInsets({
                                top:0
                        },{
                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                        });                                
                }
                if(Ti.Network.online){
                        self.refresh(false);
                }
                if(is_hide_indicator){
                        self.hide_indicator();
                }
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.end_download_more_jobs_by_scroll_down');
                return;
        }        
};

/*
 * save everyday's job count for selected month in my calendar.
 */
calendar_page.prototype.save_job_and_quote_count_for_selected_start_date_and_end_date = function(responseText){
        var self = this;                
        try{
                var result = JSON.parse(responseText);
                var db = Titanium.Database.open(self.get_db_name()); 
                self.update_my_job_and_quote_count_info_table(db,result);
                db.close();
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.save_job_and_quote_count_for_selected_start_date_and_end_date');
                return;
        }
};
/** 
 *  download selected date 's jobs or quotes
 */
calendar_page.prototype.download_selected_date_jobs = function(){
        var self = this;
        try{
                var temp_company_id = Ti.App.Properties.getString('current_company_id');
                var existed_job_id_string_in_selected_date = self.get_existed_job_or_quote_id_string_by_selected_date_and_user_id('job',temp_company_id,self.calendar_year+'-'+(((self.calendar_month+1)<=9)?'0'+(self.calendar_month+1):(self.calendar_month+1))+'-'+((self.calendar_date<=9)?'0'+self.calendar_date:self.calendar_date),self.selected_user_id);
                var existed_quote_id_string_in_selected_date = self.get_existed_job_or_quote_id_string_by_selected_date_and_user_id('quote',temp_company_id,self.calendar_year+'-'+(((self.calendar_month+1)<=9)?'0'+(self.calendar_month+1):(self.calendar_month+1))+'-'+((self.calendar_date<=9)?'0'+self.calendar_date:self.calendar_date),self.selected_user_id);
                
                //get week start date and end date ,so as to get all data (include selected week, selected month)
                var start_date = self.get_the_first_day_of_this_week(self.calendar_year, self.calendar_month, self.calendar_date);
                var end_date = '';
                var start_day_array = start_date.split('-');
                var temp_new_year = parseInt(start_day_array[0],10);
                var temp_new_month = parseInt(start_day_array[1],10)-1;
                var temp_new_date = parseInt(start_day_array[2],10);          
                for(var i=0;i<7;i++){
                        if(i === 0){
                        }else{
                                temp_new_date++;
                                if(temp_new_date > self.days_number_of_month(temp_new_year,temp_new_month)){
                                        temp_new_date -= self.days_number_of_month(temp_new_year,temp_new_month);
                                        temp_new_month++;
                                        if(temp_new_month > 11){
                                                temp_new_month = 0;
                                                temp_new_year++;
                                        }
                                }
                        }
                }
                end_date = temp_new_year+'-'+((temp_new_month+1)<=9?'0'+(temp_new_month+1):(temp_new_month+1))+'-'+((temp_new_date)<=9?'0'+(temp_new_date):(temp_new_date));
                
                var xhr = null;
                if(self.set_enable_keep_alive){
                        xhr = Ti.Network.createHTTPClient({
                                enableKeepAlive:false
                        });
                }else{
                        xhr = Ti.Network.createHTTPClient();
                }
                xhr.onload = function(){
                        try{               
                                if((xhr.readyState === 4)&&(this.status === 200)){
                                        if(self.return_to_login_page_if_user_security_session_changed(this.responseText)){
                                                return;
                                        }                                   
                                        if(self.display_app_version_incompatiable(this.responseText)){
                                                Ti.App.Properties.setBool('lock_table_flag',false);
                                                setTimeout(function(){
                                                        switch(self.view_name){
                                                                case 'list':
                                                                        self.show_list(false);
                                                                        break;
                                                                case 'cal':
                                                                        self.show_calendar(false);
                                                                        break;
                                                                case 'day':
                                                                        self.show_day(false);
                                                                        break;
                                                                case 'week':
                                                                        self.show_week(false);
                                                                        break;
                                                                case 'month':
                                                                        self.show_month(false);
                                                                        break;
                                                        }
                                                },500);                                                 
                                                return;
                                        }                           
                                        self.refresh_job_and_relative_tables(this.responseText,'all');       
                                        self.save_job_and_quote_count_for_selected_start_date_and_end_date(this.responseText);
                                }
                                Ti.App.Properties.setBool('lock_table_flag',false);
                                setTimeout(function(){
                                        switch(self.view_name){
                                                case 'list':
                                                        self.show_list(false);
                                                        break;
                                                case 'cal':
                                                        self.show_calendar(false);
                                                        break;
                                                case 'day':
                                                        self.show_day(false);
                                                        break;
                                                case 'week':
                                                        self.show_week(false);
                                                        break;
                                                case 'month':
                                                        self.show_month(false);
                                                        break;
                                        }
                                },500);                                  
                        }catch(e){
                                self.hide_indicator();
                                Ti.App.Properties.setBool('lock_table_flag',false);
                                setTimeout(function(){
                                        switch(self.view_name){
                                                case 'list':
                                                        self.show_list(false);
                                                        break;
                                                case 'cal':
                                                        self.show_calendar(false);
                                                        break;
                                                case 'day':
                                                        self.show_day(false);
                                                        break;
                                                case 'week':
                                                        self.show_week(false);
                                                        break;
                                                case 'month':
                                                        self.show_month(false);
                                                        break;
                                        }
                                },500); 
                                return;
                        }
                };
                xhr.ondatastream = function(e){
                        self.update_progress(e.progress,true);
                };
                xhr.onerror = function(e){
                        self.hide_indicator();
                        Ti.App.Properties.setBool('lock_table_flag',false);
                        setTimeout(function(){
                                switch(self.view_name){
                                        case 'list':
                                                self.show_list(false);
                                                break;
                                        case 'cal':
                                                self.show_calendar(false);
                                                break;
                                        case 'day':
                                                self.show_day(false);
                                                break;
                                        case 'week':
                                                self.show_week(false);
                                                break;
                                        case 'month':
                                                self.show_month(false);
                                                break;
                                }
                        },500); 
                        return;
                };
                xhr.setTimeout(self.default_time_out);
                xhr.open('POST',self.get_host_url()+'update',false);
                xhr.send({
                        'type':'download_my_job',
                        'hash':Ti.App.Properties.getString('current_login_user_id'),
                        'company_id':temp_company_id,
                        'user_id':self.selected_user_id,
                        'source':'team_view',
                        'start_date':start_date,
                        'end_date':end_date,
                        'date':self.calendar_year+'-'+(((self.calendar_month+1)<=9)?'0'+(self.calendar_month+1):(self.calendar_month+1))+'-'+((self.calendar_date<=9)?'0'+self.calendar_date:self.calendar_date),
                        'existed_job_id_string_in_selected_date':existed_job_id_string_in_selected_date,
                        'existed_quote_id_string_in_selected_date':existed_quote_id_string_in_selected_date,
                        'download_type':'both',
                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                        'app_version_increment':self.version_increment,
                        'app_version':self.version,
                        'app_platform':self.get_platform_info()
                });                
        }catch(err){
                self.hide_indicator();    
                Ti.App.Properties.setBool('lock_table_flag',false);
                setTimeout(function(){
                        switch(self.view_name){
                                case 'list':
                                        self.show_list(false);
                                        break;
                                case 'cal':
                                        self.show_calendar(false);
                                        break;
                                case 'day':
                                        self.show_day(false);
                                        break;
                                case 'week':
                                        self.show_week(false);
                                        break;
                                case 'month':
                                        self.show_month(false);
                                        break;
                        }
                },500); 
                return;
        }
};
/**
 *  update data by latest log and download selected date's jobs or quotes
 */
calendar_page.prototype.update_and_download_data = function(){
        var self = this;
        try{
                if(Ti.Network.online){
                        Ti.App.Properties.setBool('lock_table_flag',true);
                        self.display_indicator('Loading Data ...');
                        //                        if(self.pull_down_to_update){
                        //                                //call latest log and update local database
                        //                                self.download_latest_log(false);
                        //                        }
                        //download more
                        self.download_selected_date_jobs();  
                        Ti.App.Properties.setBool('lock_table_flag',false);
                }else{
                        switch(self.view_name){
                                case 'list':
                                        break;
                                case 'cal':
                                        self.show_calendar(true);
                                        break;
                                case 'day':
                                        self.show_day(true);
                                        break;
                                case 'week':
                                        self.show_week(true);
                                        break;
                                case 'month':
                                        self.show_month(true);
                                        break;
                        }
                }                
        } catch(err){
                Ti.App.Properties.setBool('lock_table_flag',false);
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.update_and_download_data');
                return;
        } 
};

/**
 *  get my job or quote number of server 
 */
calendar_page.prototype.get_my_job_or_quote_number = function(){
        var self = this;
        try{
                var db = Titanium.Database.open(self.get_db_name());                
                var rows = db.execute('SELECT * FROM my_summary where id=?',self.selected_user_id);
                if(rows.isValidRow()){
                        if(((self.current_selected_calendar_type_in_list === 'job') && (self.current_job_status_index === -1)) || (self.current_selected_calendar_type_in_list === 'quote') && (self.current_quote_status_index === -1)){
                                self.my_job_number_on_server = rows.fieldByName('my_job_total_number_on_server');                    
                                self.my_quote_number_on_server = rows.fieldByName('my_quote_total_number_on_server');   
                        }else{
                                var job_status_number_on_server = rows.fieldByName('my_job_status_number_on_server');                    
                                var quote_status_number_on_server = rows.fieldByName('my_quote_status_number_on_server');                                
                                var job_status_number_on_server_array = job_status_number_on_server.split(',');
                                if(job_status_number_on_server_array.length > 0){
                                        for(var i=0,j=job_status_number_on_server_array.length;i<j;i++){
                                                var temp_array = job_status_number_on_server_array[i].split(':');
                                                if(temp_array.length > 1){
                                                        if(temp_array[0] == self.current_job_status_index){
                                                                self.my_job_number_on_server = temp_array[1];
                                                                break;
                                                        }
                                                }
                                        }
                                }
                                var quote_status_number_on_server_array = quote_status_number_on_server.split(',');
                                if(quote_status_number_on_server_array.length > 0){
                                        for(i=0,j=quote_status_number_on_server_array.length;i<j;i++){
                                                temp_array = quote_status_number_on_server_array[i].split(':');
                                                if(temp_array.length > 1){
                                                        if(temp_array[0] == self.current_quote_status_index){
                                                                self.my_quote_number_on_server = temp_array[1];
                                                                break;
                                                        }
                                                }
                                        }
                                }                                
                        }                                
                }
                rows.close();

                if(self.current_job_status_index === -1){
                        rows = db.execute('SELECT count(*) as count from my_job as job where job.company_id=? and job.status_code=1 and job.is_task=0 and job.id < 1000000000 and id in (select distinct(a.job_id) from my_job_assigned_user  as a where a.status_code=1 and a.manager_user_id=?)',self.selected_company_id,self.selected_user_id);
                }else{
                        rows = db.execute('SELECT count(*) as count from my_job as job where job.company_id=? and job.status_code=1 and job.is_task=0 and job.id < 1000000000 and id in (select distinct(a.job_id) from my_job_assigned_user  as a where a.status_code=1 and a.manager_user_id=?) and job.job_status_code=?',self.selected_company_id,self.selected_user_id,self.current_job_status_index);
                }
                if(rows.isValidRow()){
                        self.my_downloaded_job_number = rows.fieldByName('count');
                }
                rows.close();
                
                if(self.current_quote_status_index === -1){
                        rows = db.execute('SELECT count(*) as count from my_quote as quote where quote.company_id=? and quote.status_code=1 and quote.is_task=0 and quote.id<1000000000 and id in (select distinct(a.quote_id) from my_quote_assigned_user  as a where a.status_code=1 and a.manager_user_id=?)',self.selected_company_id,self.selected_user_id);
                }else{
                        rows = db.execute('SELECT count(*) as count from my_quote as quote where quote.company_id=? and quote.status_code=1 and quote.is_task=0 and quote.id<1000000000 and id in (select distinct(a.quote_id) from my_quote_assigned_user  as a where a.status_code=1 and a.manager_user_id=?) and quote.quote_status_code=?',self.selected_company_id,self.selected_user_id,self.current_quote_status_index);
                }
                if(rows.isValidRow()){
                        self.my_downloaded_quote_number = rows.fieldByName('count');
                }
                rows.close();                
                
                db.close();                
        }catch(err){
                self.process_simple_error_message(err,self.window_source+' - calendar_page.prototype.get_my_job_or_quote_number');
                return;
        }
};