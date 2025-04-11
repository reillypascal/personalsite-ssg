#!/bin/sh

while getopts ":lr:" option; do
    case "${option}" in
        l)
            interaction_title="Liked"
            interaction_tag=like
            ;;
        r)
            interaction_title="RSVP"
            interaction_tag="rsvp"
            rsvp_value=${OPTARG}
            ;;
    esac
done

echo "interaction_title=${interaction_title}, interaction_tag=${interaction_tag}, rsvp_value=${rsvp_value}"