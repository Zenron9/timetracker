<?php declare(strict_types=1);

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Model\Base as Base;

#[ORM\Entity]
#[ORM\Table(name: 'users_ticket_systems')]
class UserTicketsystem extends Base
{
    #[ORM\Id]
    #[ORM\Column(type: Types::INTEGER)]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    protected $id;

    #[ORM\ManyToOne(targetEntity: 'TicketSystem', inversedBy: 'userTicketsystems')]
    protected $ticketSystem;

    #[ORM\ManyToOne(targetEntity: 'User', inversedBy: 'userTicketsystems')]
    protected $user;

    #[ORM\Column(type: Types::STRING, length: 50, options: ["default" => ''])]
    protected $accessToken = '';

    #[ORM\Column(type: Types::STRING, length: 50, options: ["default" => ''])]
    protected $tokenSecret = '';

    #[ORM\Column(type: Types::BOOLEAN, options: ["default" => 0])]
    protected $avoidConnection = false;

    /**
     * @return mixed
     */
    public function getId(): mixed
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     *
     * @return $this
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return TicketSystem
     */
    public function getTicketSystem(): TicketSystem
    {
        return $this->ticketSystem;
    }

    /**
     * @return $this
     */
    public function setTicketSystem(TicketSystem $ticketSystem)
    {
        $this->ticketSystem = $ticketSystem;

        return $this;
    }

    /**
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @return $this
     */
    public function setUser(User $user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return string
     */
    public function getAccessToken(): string
    {
        return $this->accessToken;
    }

    /**
     * @param string $accessToken
     *
     * @return $this
     */
    public function setAccessToken(string $accessToken)
    {
        $this->accessToken = $accessToken;

        return $this;
    }

    /**
     * @return string
     */
    public function getTokenSecret(): string
    {
        return $this->tokenSecret;
    }

    /**
     * @param string $tokenSecret
     *
     * @return $this
     */
    public function setTokenSecret(string $tokenSecret)
    {
        $this->tokenSecret = $tokenSecret;

        return $this;
    }

    /**
     * @return bool
     */
    public function getAvoidConnection(): bool
    {
        return 1 === $this->avoidConnection;
    }

    /**
     * @param bool $avoidConnection
     *
     * @return $this
     */
    public function setAvoidConnection(bool $avoidConnection)
    {
        $this->avoidConnection = ($avoidConnection ? 1 : 0);

        return $this;
    }
}
