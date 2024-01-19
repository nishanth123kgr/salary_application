from flask import Flask, render_template, request
from flask_socketio import SocketIO
from staff_salary_report import read_data, generate_reports
from engineio.async_drivers import threading
import webbrowser
from threading import Timer



app = Flask(__name__)
socketio = SocketIO (
      app,
      async_mode="threading"
 )


@app.route('/', methods=['GET', 'POST'])
def show_index():
    if request.method == 'POST':
        salary_data, staff_data = request.files.values()
        print(salary_data)
        data, report = read_data(salary_data, staff_data)
        print(data)
        socketio.emit('data-ready', data.values.tolist())
        generate_reports(data, report, socketio)
        
        return {'status': 'ok'}
    return render_template('index.html')

@socketio.on('message')
def handle_message(message):
    print(message)

def open_browser():
    webbrowser.open_new("http://127.0.0.1:5000")


if __name__ == '__main__':
    Timer(1, open_browser).start()
    socketio.run(app, allow_unsafe_werkzeug=True, port=5000)
    webbrowser.open_new(f'http://127.0.0.1:{socketio.server_port}')