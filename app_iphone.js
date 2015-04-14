var app_page = function() {
        
        function isiOS7Plus()
        {
                // iOS-specific test
                if (Titanium.Platform.name == 'iPhone OS')
                {
                        var version = Titanium.Platform.version.split(".");
                        var major = parseInt(version[0],10);

                        // Can only test this support on a 3.2+ device
                        if (major >= 7)
                        {
                                return true;
                        }
                }
                return false;
        }                
        
        Ti.UI.setBackgroundColor('#fff');
        var base_folder_name  = Ti.Filesystem.resourcesDirectory + 'fieldteam/';
        Ti.App.Properties.setString('base_folder_name', base_folder_name);
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        Titanium.App.Properties.setString('last_time_send_gps_location', 0);
        Titanium.App.Properties.setString('current_login_user_id', 0);
        Titanium.App.Properties.setString('current_company_id', 0);
        Titanium.App.Properties.setBool('lock_table_flag',false);
        Titanium.App.selectWindowObject = null;

        var tabGroup = Titanium.UI.createTabGroup({
                });
        var main_win = null;
        //my jobs
        main_win = Titanium.UI.createWindow({
                url : base_folder_name + 'index/index.js',
                titleImage:'/images/icons/fieldteam_title_bar_6.png',
                animate : true,
                tabBarHidden : true
        });
        var tab1 = Titanium.UI.createTab({
                title : 'FieldTeam',
                window : main_win
        });        
        tabGroup.addTab(tab1);
        //tabGroup.setActiveTab(0);   
        tabGroup.open();
        
        var login_window = Ti.UI.createWindow({
                title : 'Login',
                fullscreen:true,
                url : base_folder_name+'login/login.js',
                first_login : true,
                tab_group_obj:tabGroup,
                zIndex:2,
                main_win:main_win
        });
        login_window.open();
        Ti.App.iOS.addEventListener('notification', function(e){
                alert(e);
        });        
}();