/**
 * This javascript class is used to parse a csv file to a JSON object.
 * The format of JSON objects used in index.html and in the custom map files in js/map-files
 * require that the data to be organized by date which is what this class handles.
 * This class constructer takes an array list that specifies the header names in order
 * to access the data in the file.
 **/
class FileParser {
	constructor(variableArray = [null, null, null, null]){
		this.datevar = variableArray[0] != null ? variableArray[0] : null;
		this.var1 = variableArray[1] != null ? variableArray[1] : null;
		this.var2 = variableArray[2] != null ? variableArray[2] : null;
		this.var3 = variableArray[3] != null ? variableArray[3] : null;
		this.csv;
		this.json;
	}

	/**
	 * Getters and Setters for header names if not specified in the constructor
	 **/
	setDateVariable(variable){
		this.datevar = variable;
	}

	getDateVariable(){
		return this.datevar;
	}

	setFirstVariable(variable){
		this.var1 = variable;
	}

	getFirstVariable(){
		return this.var1;
	}

	setSecondVariable(variable){
		this.var2 = variable;
	}

	getSecondVariable(){
		return var2;
	}

	setThirdVariable(variable){
		this.var2 = variable;
	}

	getThirdVariable(){
		return var3;
	}

	/**
	 * Parses the csv file to JSON object
	 * @param {String} filname - String representing the local path to the csv filename
	 * @returns {object} JSON Object - The result of converting the csv file to a JSON object.
	 **/
	csvToJson(filename){
		var that = this;
		return $.ajax({
			url: filename,
			accepts: "text/csv; charset=utf-8",
			error: function(error){
				console.log(filename)
				throw new Error(error);
			}, 
			success: function(data){
				that.csv = data;
				Papa.parse(data, {
					header:true,
					comments:true,
					dynamicTyping:true,
					skipEmptyLines:true,
					complete: function(data){
						that.json = that.convertData(data, that);
					}
				})
			},
			timeout: 5000
		})
	}

	/**
	 * Converts the Json data from the default returned via Papaparse 
	 * into the necessary data format with data organized by date.
	 * @param {object} JSON Object - a JSON Object containing data from the original csv file 
	 * in the format parsed via Papaparse
	 * @param {object} that - self referenc to the FileParser object.
	 * @returns {object} JSON Object - the JSON Object converted to the necessary format organized
	 * by date.
	 **/ 
	convertData(json, that){
		var firstValue = json.data[0]
			var year = firstValue[that.datevar];
			var ret = {"data":[]};
			var data = ret["data"];
			data[year] = {};
			json.data.forEach(function(row){
				var currdate = row[that.datevar];
				if(year == currdate){
					data[year][row[that.var1].trim()] = (that.var3 != null) ? [row[that.var2], row[that.var3]] : row[that.var2];
				}else{
					year = currdate;
					data[year] = {};
					data[year][row[that.var1].trim()] = (that.var3 != null) ? [row[that.var2], row[that.var3]] : row[that.var2];
				}
			})
			return ret;
	}

	/**
	 * Returns the data in JSON format
	 * @returns {object} JSON Object - the JSON Object parsed by FileParser, organized by date.
	 **/
	getJsonData(){
		return this.json;
	}

	/**
	 * Returns the data in CSV format
	 * @returns {object} CSV data - the original data in csv format
	 **/
	getCSVData(){
		return this.csv;
	}
}