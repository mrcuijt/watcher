/*生产环境监控配置*/
var path = require('path');
var configUtil = require('../configUtil');
try{
	var autoWatcher = require('./autoIndex.json');
}catch(e){};
var watcher = (autoWatcher || []).concat([
	// {
	// 	'path': 'd:/test/html/1.html',
	// 	'isFile': true,	//是否是文件
	// 	'rsync': [{
	// 			'address': 'sam@61.4.185.111:/zkTest/html/1.html',
	// 			'port': 2222
	// 		}, {
	// 			'address': 'sam@61.4.185.111:/zkTest/html/1.html'
	// 		}
	// 	]
	// }
	// ,
	// {
	// 	'path': '/opt/deploy/apache-tomcat-6.0.35/webapps/web/indexfc/',
	// 	'rsync': [{
	// 			'address': 'sam@61.4.185.111:/zkTest/html/',
	// 			'port': 2222,
	// 			'param': "--exclude '2010/' --exclude '2011/' --exclude '2012/'"
	// 		}, {
	// 			'address': 'sam@61.4.185.111:/zkTest/html/',
	// 			'param': "--exclude '2010/' --exclude '2011/' --exclude '2012/'"
	// 		}
	// 	]
	// }
	// ,
	// {
	// 	'path': 'd:/test/html/a1/www.weather.com.cn/',
	// 	'rsync': [{
	// 			'address': 'sam@61.4.185.111:/zkTest/www.weather.com.cn/',
	// 			'port': 2222,
	// 			'logPrefix': '61.4.185.111'
	// 		}, {
	// 			'address': 'sam@61.4.185.111:/zkTest/www.weather.com.cn/'
	// 		}
	// 	]
	// }
	// ,
	{
		'path': 'd:/test/html/b1/',
		'rsync': [{
				'address': 'sam@61.4.185.111:/zkTest/html/b1/',//同步的目标地址
				'port': 2222,	//[可选]同步的目标端口，默认设置为rsync.defaultPort
				'logPrefix': 'rsync_1' //[可选]同步信息的日志前缀，默认为'rsync_索引'
			}, {
				'address': 'sam@61.4.185.112:/zkTest/html/b1/'
			}
		]
	}
]);
var config = {
	isDebug: false,
	/*更新监控目录可以调用 `node memoryWatcher.js reload` */
	watcher: watcher,
	port: 3333, //文件夹树访问端口
	host: '127.0.0.1', //文件夹树访问host
	copyToPath: 'd:/test/temp', //缓存文件队列
	logPath: 'd:/test/log',
	create_delay: 1000*60*5,//允许的创建文件的延时时间,初始化监控时用
	deletedFileName: '____delete____', //删除信息存放路径，在缓存文件队列路径下
	flock: { //监控文件锁定执行
		bin: '/usr/bin/flock',
		lockFile: '/var/run/watcher.lock'
	},
	node: { //配置node
		bin: 'node'
	},
	rsync: { //配置rsync
		bin: '/usr/bin/rsync',
		param: "-WPaz",
		user: 'sam',
		defaultPort: 2222
	},
	dealLogPrefix: 'deal',//处理内存数据日志前缀
	runLogPrefix: 'run',//run.js运行日志前缀
	rsyncErrLogPrefix: 'rsyncErr'//同步时错误日志
	,ip: '192.168.1.120',
	delay: {
		run: 3000,		//处理程序的间隔时间
		rsync: 1000*20,	//rsync程序执行的超时时间
		curl: 1000*5	//执行curl得到内存数据的超时时间
	}
	,max_deal_num: 2000//单次处理的最大文件数
}
//配置删除信息文件
// config.deleteRsync = [{
// 		'address': 'sam@61.4.185.111:/zkTest/serverOne/',
// 	}, {
// 		'address': 'sam@61.4.185.111:/zkTest/serverTwo/'
// 	}
// ];
module.exports = configUtil.index(config);
if(process.argv[1] == __filename){
	configUtil.check(module.exports);
}