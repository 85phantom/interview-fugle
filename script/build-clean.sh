#!/bin/bash

for i in `find ./src | grep '.js$'`
do
echo "Deleted $i"
rm -f $i
done

for i in `find ./src | grep '.js.map$'`
do
echo "Deleted $i"
rm -f $i
done
