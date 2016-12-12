while true; do
    inotifywait -e modify *.ts public/*
    tsc
    (echo -e "reload\n" | netcat -w1 localhost 32000)&
    pid=$!
    sleep 1
    kill $pid
done
