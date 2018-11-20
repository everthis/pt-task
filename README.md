# pt-task

* 位于HK和Tokyo的主机保持文件目录结构一致。
* rsync, upload由位于HK的主机执行，其余由位于Tokyo的主机执行。
* rsync, upload的开始指令由位于Tokyo的Rails应用直接触发。