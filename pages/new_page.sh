#!/bin/bash
echo $1 $2

if [[ $2 == "three" ]] 
then
  mkdir $1 && cd $1 && cp ../../utils/Three/template.html index.html && cp ../../utils/Three/template.js main.js
elif [[ $2 == "babylon" ]]
then
    echo "babylon"
fi
