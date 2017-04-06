#! /bin/bash
function fixcrop {
	aw=5 #desired aspect ratio width...
	ah=4 #and height
	in=$1
	out=$1

	wid=`convert "$in" -format "%[w]" info:`
	hei=`convert "$in" -format "%[h]" info:`

	tarar=`echo $aw/$ah | bc -l`
	imgar=`convert "$in" -format "%[fx:w/h]" info:`

	if (( $(bc <<< "$tarar > $imgar") ))
	then
	  nhei=`echo $wid/$tarar | bc`
	  convert "$in" -gravity center -crop ${wid}x${nhei}+0+0 "$out"
	elif (( $(bc <<< "$tarar < $imgar") ))
	then
	  nwid=`echo $hei*$tarar | bc`
	  convert "$in" -gravity center -crop ${nwid}x${hei}+0+0 "$out"
fi
}
testfunc () {
	echo $1;
}
for f in *.jpg; do
	fixcrop $f
done
for f in *.jpeg; do
	fixcrop $f
done
