import win32gui
import win32process
import psutil

def get_active_app():
    hwnd = win32gui.GetForegroundWindow()
    if not hwnd:
        return None

    _, pid = win32process.GetWindowThreadProcessId(hwnd)
    try:
        return psutil.Process(pid).name()
    except psutil.Error:
        return None
