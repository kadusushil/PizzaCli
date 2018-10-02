/**
 * Holds all the tasks related to CLI.
 *
 **/

// Dependencies.
const readline = require("readline");
const util = require("util");
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events {};
const e = new _events();
const os = require('os');
const v8 = require('v8');
const _data = require('./data');

// Instantiate CLI.
const cli = {};

e.on('man', (str) => {
  cli.responders.help();
});

e.on('help', (str) => {
  cli.responders.help();
});

e.on('exit', (str) => {
  cli.responders.exit();
});

e.on('list users', (str) => {
  cli.responders.listUsers();
});

e.on('menu', (str) => {
  cli.responders.showMenu();
});

e.on('recent orders', (str) => {
  cli.responders.recentOrders(str);
});

e.on('order info', (str) => {
  cli.responders.orderInfo(str);
});

e.on('recent users', (str) => {
  cli.responders.recentUsers(str);
});

e.on('user info', (str) => {
  cli.responders.userInfo(str);
});

e.on('stats', (str) => {
  cli.responders.stats();
});

e.on('view orders', (str) => {
  cli.responders.viewOrders(str);
});

cli.responders = {};

// help/man
cli.responders.help = () => {
  console.log('You asked for help');
  const commands = {
    'exit': 'Kills the entire app',
    'man' : 'Gives your information of all the powers you have',
    'help': 'Alias of "man" command',
    'list users' : 'List all the users of the system',
    'list logs' : '',
    'more log info': '',
    'menu' : 'View current menu',
    'recent orders' : 'View orders from last 24 hours',
    'view orders --hrs' : 'View all order in given hours or default 24 hours',
    'order info --id' : 'View specific order details by providing order id',
    'recent users --hrs' : 'View all users from provided hours, default 24 hours',
    'user info --email' : 'View user information from given e-mail',
    'stats' : 'Show system statistics'
  };

  // show a header which as wide as the screen.
  cli.horizontalLine();

  cli.centered('CLI MANUAL');

  cli.horizontalLine();

  cli.verticalSpace(2);

  // show each command with explaination
  for (var key in commands) {
    if (commands.hasOwnProperty(key)) {
      const value = commands[key];
      var line = '\x1b[33m' + key + '\x1b[0m'
      const padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line+=' ';
      }
      line += value;
      console.log(line);
      cli.verticalSpace(1);
    }
  }

  cli.verticalSpace(2);
  cli.horizontalLine();
};

cli.verticalSpace = (noOfLines) => {
  const lines = typeof(noOfLines) == 'number' && noOfLines > 0 ? noOfLines : 0;
  for (i = 0; i < lines; i++) {
    console.log('');
  }
};

cli.horizontalLine = () => {
  // get the available screen size.
  const width = process.stdout.columns;
  var line = '';

  for (i = 0; i < width; i++) {
    line += '-';
  }
  console.log(line);
};

cli.centered = (str) => {

  str = typeof(str) == 'string' && str.trim().length > 0 ? str : false;

  if (str) {
        const totalSpace = (process.stdout.columns - str.trim().length)/2;
        var text = '';
        for (i = 0; i < totalSpace; i++) {
          text += ' ';
        }
        text += str.trim();
        console.log(text);
  }
}

// help/man
cli.responders.exit = () => {
  console.log('You asked for exit');
  process.exit();
};

// show menu
cli.responders.showMenu = () => {
  console.log('You asked for menu');
  _data.readFile('menu', 'menu', (error, menuData) => {
    if (!error && menuData) {
      console.dir(menuData, {'colors':true});
    }
  });
};

// List users
cli.responders.listUsers = () => {
  console.log('List all users of the system');
  _data.listFiles('users', true, (error, userDataArray) => {

    if (!error && userDataArray && userDataArray.length > 0) {
      userDataArray.forEach((userDataName) => {
        cli.verticalSpace();
        _data.readFile('users', userDataName, (error, userData) => {
          var line = 'Name : ' + userData.firstName + ' ' + userData.lastName + ' Email: ' + userData.email;
          console.log(line);
          cli.verticalSpace();
        });
      });
    } else {
      console.log('No users found in the system');
    }
  });
};

// View orders from given hours
cli.responders.viewOrders = (str) => {
  const orderArray = str.split('--');
  const noOfHours = typeof(orderArray[1]) == 'string' && orderArray[1].trim().length > 0 ?
                  orderArray[1] : 24;

  const cutOffOrders = Date.now() - (noOfHours * 60 * 60 * 1000);

  cli.horizontalLine();
  cli.centered('Orders in last ' + noOfHours + ' hours');
  cli.horizontalLine();
  _data.listFiles('history', true, (error, orders) => {
    if (!error && orders) {
      orders.forEach((order) => {
        _data.readFile('history', order, (error, orderData) => {
          if (!error && orderData) {
            if (orderData.date >= cutOffOrders) {
              console.log(order);
            }
          }
        });

      });
    }
  });
};

// recent orders
cli.responders.recentOrders = (str) => {
  console.log('You asked for recent orders');
};

// order info
cli.responders.orderInfo = (str) => {
  console.log('You asked for order info');
  const orderArray = str.split('--');
  const orderId = typeof(orderArray[1]) == 'string' && orderArray[1].trim().length > 0 ?
                  orderArray[1] : false;

  if (orderId) {
    _data.readFile('history', orderId, (error, orderData) => {
      if (!error && orderData) {
        cli.verticalSpace();
        console.dir(orderData, {'colors': true});
      }
    });
  }
};

// recent users
cli.responders.recentUsers = (str) => {
  console.log('You asked for recent users: ', str);
  const hoursArray = str.split('--');

  const noOfHours = typeof(hoursArray[1]) == 'string' ? hoursArray[1] : 24;
  const cutOffDate = Date.now() - (noOfHours * 60 * 60 * 1000);

  cli.horizontalLine()
  cli.centered('Users signed up in last ' + noOfHours + ' hours');
  cli.horizontalLine();
  // go through all users having signup date after this.

  var counter = 0;
  _data.listFiles('users', true, (error, userDataArray) => {
    if (!error && userDataArray && userDataArray.length > 0) {
      userDataArray.forEach((userDataId) => {
        _data.readFile('users', userDataId, (error, userData) => {
          if (!error && userData) {
            if (userData.date >= cutOffDate) {
              // valid candidate
              counter++;
              console.log(counter + '. ' + userData.email);
            }
          }
        });
      });
    }
  });

};

// User info
cli.responders.userInfo = (str) => {
  console.log('You asked for user info');
  const userInfoArray = str.split('--');
  const email = typeof(userInfoArray[1]) == 'string' && userInfoArray[1].trim().length > 0
                    ? userInfoArray[1] : false;

  if (email) {
    _data.readFile('users', email, (error, data) => {
      if (!error && data) {
        delete data.password;
        cli.verticalSpace();
        console.dir(data, {'colors': true});
        cli.verticalSpace();
      }
    });
  }
};

// stats
cli.responders.stats = () => {
  const stats = {
    'Load Average' : os.loadavg().join(' '),
    'CPU Count' : os.cpus().length,
    'Free Memory' : os.freemem(),
    'Current Mallocated Memory' : v8.getHeapStatistics().malloced_memory,
    'Peak Mallocated Memory' : v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used' : Math.round((v8.getHeapStatistics().used_heap_size/v8.getHeapStatistics().total_heap_size) * 100),
    'Available Heap Allocated' : Math.round((v8.getHeapStatistics().total_heap_size/v8.getHeapStatistics().heap_size_limit) * 100),
    'Uptime': os.uptime() + ' Seconds',
  };

  // show a header which as wide as the screen.
  cli.horizontalLine();

  cli.centered('SYSTEM STATISTICS');

  cli.horizontalLine();

  cli.verticalSpace(2);

  // show each command with explaination
  for (var key in stats) {
    if (stats.hasOwnProperty(key)) {
      const value = stats[key];
      var line = '\x1b[33m' + key + '\x1b[0m'
      const padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line+=' ';
      }
      line += value;
      console.log(line);
      cli.verticalSpace(1);
    }
  }

  cli.verticalSpace(2);
  cli.horizontalLine();
};

/**
 * Process the input received from user.
 **/
cli.processInput = (str) => {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str : false;

  if (str) {
    // Codify the unique string that we care about
    const uniqueInputs = [
      'man',
      'help',
      'exit',
      'list users',
      'stats',
      'more user info',
      'list logs',
      'more log info',
      'menu',
      'recent orders',
      'order info',
      'recent users',
      'user info',
      'view orders'
    ];

    // go through the possible inputs and emmit an event
    var matchFound = false;
    var counter = 0;

    uniqueInputs.some((input) => {
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;
        // emit the event
        e.emit(input, str);
        return true;
      }
    });

    // if not match found
    if (!matchFound) {
      console.log('Sorry, no match found!');
    }
  }
};

// Initializes the commands
cli.init = () => {
  // Send to console, in dark blue
  console.log('\x1b[34m%s\x1b[0m','The CLI is running');

  // start the interface
  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
  });

  // create an initial prompt
  _interface.prompt();

  _interface.on('line', (str) => {
    // send it to the processor
    cli.processInput(str);

    // re-initialize the prompt
    _interface.prompt();
  });

  // closing the cli
  _interface.on('close', () => {
    process.exit(0);
  });
};



// export the module
module.exports = cli;
