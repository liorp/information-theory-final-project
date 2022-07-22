import time


class Timer:
    def __init__(self):
        self._start_times = []
        self._stop_times = []
        self._messages = []

    def start(self):
        """
        Start a new timer.
        """
        self._start_times.append(time.perf_counter())

    def add_message(self, message):
        """
        Add message to be reported for the last elapsed time.
        :param message: The message to be appended to the messages list of the timer.
        :type message: str
        """
        self._messages.append(message)

    def stop(self, message=None, start_again=False):
        """
        Stop the timer and optionally start a new one.
        """
        stop_time = time.perf_counter()
        self._stop_times.append(stop_time)

        if message is not None:
            self.add_message(message)

        if start_again:
            self.start()

    def report(self):
        """
        Report elapsed times with corresponding messages.
        """
        assert len(self._start_times) == len(self._stop_times) == len(self._messages)

        for start_time, stop_time, message in zip(self._start_times, self._stop_times, self._messages):
            elapsed_time = stop_time - start_time
            print(f"{message}: {elapsed_time:0.4f} seconds")

    def flush(self):
        """
        Delete all entries (times and messages) in the timers internal lists.
        """
        self._start_times = []
        self._stop_times = []
        self._messages = []

    def __enter__(self):
        """
        Start a new timer as a context manager.
        :return: current timer instance
        :rtype: Timer
        """
        self.start()
        return self

    def __exit__(self):
        """
        Stop the timer as a context manager.
        :return: current timer instance
        :rtype: Timer
        """
        self.stop()
