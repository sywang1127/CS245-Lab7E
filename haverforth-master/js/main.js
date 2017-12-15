// See the following on using objects as key/value dictionaries
// https://stackoverflow.com/questions/1208222/how-to-do-associative-array-hashing-in-javascript
var words = {};
var users = {};

/** 
 * When the length of stack is larger than 0, then pop
 */
function emptyStack(stack) {
    while (stack.length>0){
	stack.pop();
    }
}



/**
 * Print a string out to the terminal, and update its scroll to the
 * bottom of the screen. You should call this so the screen is
 * properly scrolled.
 * @param {Terminal} terminal - The `terminal` object to write to
 * @param {string}   msg      - The message to print to the terminal
 */
function print(terminal, msg) {
    terminal.print(msg);
    $("#terminal").scrollTop($('#terminal')[0].scrollHeight + 40);
}

/** 
 * Sync up the HTML with the stack in memory
 * @param {Array[Number]} The stack to render
 */
function renderStack(stack) {
    $("#thestack").empty();
    stack.slice().reverse().forEach(function(element) {
        $("#thestack").append("<tr><td>" + element + "</td></tr>");
    });
};

/** 
 * Process a user input, update the stack accordingly, write a
 * response out to some terminal.
 * @param {Array[Number]} stack - The stack to work on
 * @param {string} input - The string the user typed
 * @param {Terminal} terminal - The terminal object
 */

function add(stack){
    var first = stack.pop();
    var second = stack.pop();
    stack.push(first+second);
}

function subtract(stack){
    var first = stack.pop();
    var second = stack.pop();
    stack.push(second-first);
}

function multiplication(stack){
    var first = stack.pop();
    var second = stack.pop();
    stack.push(second*first);
}

function division(stack){
    var first = stack.pop();
    var second = stack.pop();
    stack.push(Math.floor(second/first));
}

function swap(stack){
    var first = stack.pop();
    var second = stack.pop();
    stack.push(first);
    stack.push(second);
}

function nip(stack){
    var first = stack.pop();
    var second = stack.pop();
    stack.push(first);
}

function over(stack){
    var first = stack.pop();
    var second = stack.pop();
    stack.push(second);
    stack.push(first);
    stack.push(second);
}

function lessThan(stack){
    var first = stack.pop();
    var second = stack.pop();
    if (second < first){
	stack.push(-1);
    }else {
	stack.push(0);
    }    
}

function equalTo(stack){
    var first = stack.pop();
    var second = stack.pop();
    if (second === first){
	stack.push(-1);
    }else {
	stack.push(0);
    }
}

function largerThan(stack){
    var first = stack.pop();
    var second = stack.pop();
    if (second > first){
	stack.push(-1);
    }else {
	stack.push(0);
    }
}

words={"+":add,"-":subtract,"*":multiplication,"/":division,"swap":swap,
       "nip":nip,"over":over,"<":lessThan,"=":equalTo, ">":largerThan};

function userDefined(stack, arr) {
    arr.forEach(function(i){
	if (!(isNaN(Number(i)))) {
            stack.push(Number(i));
	} else if (i in words) {
	    var func = words[i];
	    func(stack);
	} else if (i in users){
	    var func = users[i];
	    userDefined(stack, func);
	}
    })
    
   renderStack(stack);
};


function process(stack, input, terminal) {
    var inputArray = input.trim().split(/ +/);
    if (inputArray[0]===":"){
	var name = inputArray[1];
	var def = inputArray.slice(2,-1);
	if (name in words){
	    print(terminal, ":-( Has been defined as a built-in function");
	} else{
	    def.forEach(function(i){
		if ((isNaN(Number(i)) && !(i in words) && !(i in users) )){
		    print(terminal, ":-( Unrecognized input");
		}
	    })
	    users[name] = def;
	}
    }else {
	inputArray.forEach(function(i){
	    if (!(isNaN(Number(i)))) {
		print(terminal,"pushing " + Number(i));
		stack.push(Number(i));   
	    } else {
		if (i in words){
		    var func = words[i];
		    func(stack);
		}else if (i in users){
		    var func = users[i];
		    userDefined(stack, func);
		}else {
		    print(terminal, ":-( Unrecognized input");
		}
	    }
	})
    }
	renderStack(stack);
	
};

function runRepl(terminal, stack) {
    terminal.input("Type a forth command:", function(line) {
        print(terminal, "User typed in: " + line);
        process(stack, line, terminal);
        runRepl(terminal, stack);
    });
};

// Whenever the page is finished loading, call this function. 
// See: https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function() {
    var terminal = new Terminal();
    terminal.setHeight("400px");
    terminal.blinkingCursor(true);
    
    // Find the "terminal" object and change it to add the HTML that
    // represents the terminal to the end of it.
    $("#terminal").append(terminal.html);

    var stack = [];
    //var resetButton = $("#reset");
    $("#reset").click(function(){
	emptyStack(stack);
	renderStack(stack);
    });

    print(terminal, "Welcome to HaverForth! v0.1");
    print(terminal, "As you type, the stack (on the right) will be kept in sync");

    runRepl(terminal, stack);
});



