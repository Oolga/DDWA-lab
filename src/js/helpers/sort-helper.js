export function sortBy(array, column){
    console.log(array);
    switch (column){
        case 'firstname':{
            debugger;
            array.sort(function(a, b){
                return stringCompare(a.getFirstname, b.getFirstname);
            });
        }
        break;
        case 'lastname':{
            debugger;
            array.sort(function(a, b){
                return stringCompare(a.getLastname, b.getLastname);
            });
        }
        break;
        case 'middlename':{
            debugger;
            array.sort(function(a, b){
                return stringCompare(a.getMiddleName, b.getMiddleName);
            });
        }
        break;
        case 'married':{
            debugger;
            array.sort(function(a, b){
                return stringCompare(a.getMerriedStatus, b.getMerriedStatus);
            });
        }
        break;
        case 'gender':{
            debugger;
            array.sort(function(a, b){
                return stringCompare(a.getGender, b.getGender);
            });
        }
        break;
        case 'position':{
            debugger;
            array.sort(function(a, b){
                return stringCompare(a.getPosition, b.getPosition);
            });
        }
        break;
    }

    return array;
}

function stringCompare(a, b){
    if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
}