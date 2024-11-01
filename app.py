import logging
from flask import Flask, render_template, request, send_file, abort
from flask_socketio import SocketIO
from staff_salary_report_new import read_data, generate_reports
import os




app = Flask(__name__)


app.config['ENV'] = 'development'
app.config['DEBUG'] = True
app.config['PROPAGATE_EXCEPTIONS'] = True








socketio = SocketIO (
      app,
      async_mode="threading"
 )


@app.route('/', methods=['GET', 'POST'])
def show_index():
    if request.method == 'POST':
        salary_data, staff_data = request.files.values()
        print(salary_data)
        period = request.form.get('period')
        print(period)
        data, report = read_data(salary_data, staff_data, period)
        print(data)
        socketio.emit('data-ready', data.values.tolist())
        generate_reports(data, report, socketio)
        
        return {'status': 'ok'}
    return render_template('index.html')

@app.route('/get_report/<filename>')
def get_report(filename):
    directory = 'C:/Salary_Application/salary_reports/pdf'
    name, period, emp_no = filename.split('_')
    
    filename = name.replace(' ', '') + period + '_' + emp_no + '.pdf'    

    file_path = os.path.join(directory, filename)
    if os.path.isfile(file_path):
        return send_file(file_path)
    else:
        abort(404, description="File not found")

@socketio.on('message')
def handle_message(message):
    print(message)




if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    socketio.run(app, port=5000, debug=True, use_reloader=False)
