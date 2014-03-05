var files = [ ]
var fileNames = [ 'index', 'validator', 'core', 'math', 'array', 'string', 'logger' ]

for (var i = 0; i < fileNames.length; i++) {
    files.push(__dirname + "/src/" + fileNames[i] + ".coffee")
}

module.exports = function (grunt) {
    grunt.initConfig({
        coffee: {
            compile: {
                options: {
                    join: true
                },
                files: {
                    'functoids.js': files
                }
            }
        },
        uglify: {
            prod: {
                files: {
                    'functoids.min.js': [ 'functoids.js' ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [ 'coffee:compile', 'uglify:prod' ]);
};
